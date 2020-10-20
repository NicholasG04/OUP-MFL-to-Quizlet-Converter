import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import DomParser, { DOMNode } from 'dom-parser';

const parser = new DomParser();

const formatLine = (line: string, toSlotIn: null | string): string[] => {
  const split = line.split('\t').filter(i => Boolean(i) && i !== ' ');
  const trimmed = split.map(i => i.trim());
  if (toSlotIn) trimmed[0] = `${trimmed[0]} ${toSlotIn.replace('\t','').trim()}`;
  return trimmed;
}

const runFormatter = async (inputPath: string, outputPath: string, fileName: string): Promise<void> => {
  const styleMap = [
    "b => h1",
    "p[style-name='<HB> Heading'] => p:fresh > h1"
  ]
  const raw = await mammoth.convertToHtml({path: `${inputPath}\\${fileName}`}, { styleMap });
  
  const dom = parser.parseFromString(raw.value);
  interface DocumentData {
    [key: string]: string[][]
  }

  const documentData: DocumentData = {} // object where key = name of current title, value = 2d array of vocab

  const titles = dom.getElementsByTagName('h1').map((e: DOMNode) => e.textContent);
  let currentTitle = titles[0];

  dom.getElementsByTagName('p').forEach((element: DOMNode, i) => {
    const textContent = element.textContent;
    const elementHTML = element.innerHTML;

    if (!textContent.includes('\t') && element.firstChild.nodeName !== 'h1') return;
    if (element.firstChild.nodeName === 'h1') {
      documentData[textContent] = [];
      currentTitle = textContent;
    } else {  
      const nextElement = dom.getElementsByTagName('p')[i+1]?.innerHTML;
      let toSlotIn = null;
      if (nextElement && !nextElement.includes('<em>') && !nextElement.includes('h1')) {
        toSlotIn = nextElement;
      }
      if (!elementHTML.includes('em')) {
        return;
      }
      const removedTagsIfExist = elementHTML.replace(/<[^>]*>/g,'');
      const formatted = formatLine(removedTagsIfExist, toSlotIn);
      documentData[currentTitle].push(formatted);
    }
  })

  const outputFileName = `${outputPath}\\${fileName}`.replace('docx','txt')
  fs.writeFile(outputFileName, '', (err) => {
    if (err) throw err;
  })

  for (const [sectionName, vocab] of Object.entries(documentData)) {
    const content = vocab.map(line => line.join('\t')).join('\n'); // Quizlet likes tabs on lines, and new lines separating cards.
    const toWrite = sectionName + '\n\n' + content + '\n\n'
    
    fs.appendFile(outputFileName, toWrite, (err) => {
      if (err) throw err;
    })
  }
  
}

const main = (): void =>  {
  console.log('Starting Formatter');
  const inputPath = path.join(path.resolve(), 'input');
  const outputPath = path.join(path.resolve(), 'output')

  const inputFiles = fs.readdirSync(inputPath).filter(i => !i.includes('$')); // Ignore word cache temp files

  console.log('Loaded paths and input files')
  console.log('Running transformations...')
  inputFiles.forEach((fileName) => runFormatter(inputPath, outputPath, fileName).then(() => console.log(`${fileName} - Completed!`)));
  // runFormatter(inputPath, outputPath, inputFiles[0]).then(() => console.log(`${inputFiles[0]} - Completed!`));
}

main();
