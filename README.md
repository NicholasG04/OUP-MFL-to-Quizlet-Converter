# OUP MFL Vocabulary to Quizlet Formatter

This repository takes an input, in the folder named `input`, of word documents from Oxford University Press' MFL vocabulary lists. I have tested it with GCSE and A-Level French vocabulary taken from Kerboodle.

It will output, in the `output` directory, text files for each word document parsed. Each will contain the title of that sub-section of vocabulary, then the list separated by new lines for each phrase and tabs between the translations. These can then be directly copied into the 'import' function of Quizlet, allowing for easy, fast and accurate conversion.

Unfortunately Quizlet do not have an API to automate this part of the process, but I am looking at ways that this could possibly be sped up.