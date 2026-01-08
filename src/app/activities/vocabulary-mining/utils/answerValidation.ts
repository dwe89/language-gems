// Comprehensive answer validation from vocab-master
export const validateAnswer = (userAnswer: string, correctAnswer: string): { isCorrect: boolean; missingAccents: boolean } => {
  // Remove punctuation and text in brackets/parentheses for comparison
  const removePunctuation = (text: string) => {
    // First remove text in brackets/parentheses (informal, formal, etc.)
    const withoutBrackets = text.replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '');
    // Normalize curly quotes to straight quotes before removing punctuation
    const normalizedQuotes = withoutBrackets.replace(/['']/g, "'").replace(/[""]/g, '"');
    return normalizedQuotes.replace(/[¿¡?!.,;:()""''«»\-]/g, '').trim().toLowerCase();
  };

  // Remove accents for comparison
  const removeAccents = (text: string) => {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  const userAnswerClean = removePunctuation(userAnswer);
  const correctAnswerClean = removePunctuation(correctAnswer);

  // Check for missing accents
  const userAnswerNoAccents = removeAccents(userAnswerClean);
  const correctAnswerNoAccents = removeAccents(correctAnswerClean);
  const missingAccents = userAnswerClean !== userAnswerNoAccents && userAnswerNoAccents === correctAnswerNoAccents;

  // Split by multiple delimiters: comma, pipe (|), semicolon, forward slash, "and", "or"
  const correctAnswers = correctAnswer
    .split(/[,|;\/]|\band\b|\bor\b/)
    .map(ans => removePunctuation(ans))
    .filter(ans => ans.length > 0);

  // Also handle parenthetical variations and gender indicators
  const expandedAnswers = correctAnswers.flatMap(answer => {
    const variations = [answer];

    // Also add the original answer without punctuation removal for exact matching
    const originalAnswer = removePunctuation(answer);
    if (originalAnswer !== answer) {
      variations.push(originalAnswer);
    }

    // Handle contractions: I'm = I am, we'll = we will, etc.
    const contractionMap: Record<string, string> = {
      "i'm": "i am",
      "you're": "you are",
      "he's": "he is",
      "she's": "she is",
      "it's": "it is",
      "we're": "we are",
      "they're": "they are",
      "i'll": "i will",
      "you'll": "you will",
      "he'll": "he will",
      "she'll": "she will",
      "it'll": "it will",
      "we'll": "we will",
      "they'll": "they will",
      "won't": "will not",
      "can't": "cannot",
      "don't": "do not",
      "doesn't": "does not",
      "didn't": "did not",
      "isn't": "is not",
      "aren't": "are not",
      "wasn't": "was not",
      "weren't": "were not",
      "haven't": "have not",
      "hasn't": "has not",
      "hadn't": "had not"
    };

    // Add contraction variations
    Object.entries(contractionMap).forEach(([contraction, expansion]) => {
      if (answer.includes(contraction)) {
        variations.push(answer.replace(contraction, expansion));
      }
      if (answer.includes(expansion)) {
        variations.push(answer.replace(expansion, contraction));
      }
    });

    // Remove content in parentheses for comparison (like "(informal)")
    const withoutParentheses = answer.replace(/\s*\([^)]*\)/g, '').trim();
    if (withoutParentheses !== answer && withoutParentheses.length > 0) {
      variations.push(withoutParentheses);
    }

    return variations;
  });

  // Check if user answer matches any variation
  const isExactMatch = expandedAnswers.some(correctAns =>
    userAnswerClean === correctAns ||
    removeAccents(userAnswerClean) === removeAccents(correctAns)
  );

  if (isExactMatch) {
    return { isCorrect: true, missingAccents };
  }

  // Handle number words vs digits (both Spanish and English)
  const numberMap: Record<string, string> = {
    // Spanish numbers
    'cero': '0', 'uno': '1', 'dos': '2', 'tres': '3', 'cuatro': '4',
    'cinco': '5', 'seis': '6', 'siete': '7', 'ocho': '8', 'nueve': '9',
    'diez': '10', 'once': '11', 'doce': '12', 'trece': '13', 'catorce': '14',
    'quince': '15', 'dieciséis': '16', 'diecisiete': '17', 'dieciocho': '18',
    'diecinueve': '19', 'veinte': '20', 'veintiuno': '21', 'treinta': '30',
    'cuarenta': '40', 'cincuenta': '50', 'sesenta': '60', 'setenta': '70',
    'ochenta': '80', 'noventa': '90', 'cien': '100', 'ciento': '100',
    // English numbers (single words)
    'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
    'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9',
    'ten': '10', 'eleven': '11', 'twelve': '12', 'thirteen': '13', 'fourteen': '14',
    'fifteen': '15', 'sixteen': '16', 'seventeen': '17', 'eighteen': '18',
    'nineteen': '19', 'twenty': '20', 'thirty': '30', 'forty': '40',
    'fifty': '50', 'sixty': '60', 'seventy': '70', 'eighty': '80',
    'ninety': '90', 'hundred': '100',
    // English hyphenated numbers
    'twenty-one': '21', 'twenty-two': '22', 'twenty-three': '23', 'twenty-four': '24',
    'twenty-five': '25', 'twenty-six': '26', 'twenty-seven': '27', 'twenty-eight': '28',
    'twenty-nine': '29', 'thirty-one': '31', 'thirty-two': '32', 'thirty-three': '33',
    'thirty-four': '34', 'thirty-five': '35', 'thirty-six': '36', 'thirty-seven': '37',
    'thirty-eight': '38', 'thirty-nine': '39', 'forty-one': '41', 'forty-two': '42',
    'forty-three': '43', 'forty-four': '44', 'forty-five': '45', 'forty-six': '46',
    'forty-seven': '47', 'forty-eight': '48', 'forty-nine': '49', 'fifty-one': '51',
    'fifty-two': '52', 'fifty-three': '53', 'fifty-four': '54', 'fifty-five': '55',
    'fifty-six': '56', 'fifty-seven': '57', 'fifty-eight': '58', 'fifty-nine': '59',
    'sixty-one': '61', 'sixty-two': '62', 'sixty-three': '63', 'sixty-four': '64',
    'sixty-five': '65', 'sixty-six': '66', 'sixty-seven': '67', 'sixty-eight': '68',
    'sixty-nine': '69', 'seventy-one': '71', 'seventy-two': '72', 'seventy-three': '73',
    'seventy-four': '74', 'seventy-five': '75', 'seventy-six': '76', 'seventy-seven': '77',
    'seventy-eight': '78', 'seventy-nine': '79', 'eighty-one': '81', 'eighty-two': '82',
    'eighty-three': '83', 'eighty-four': '84', 'eighty-five': '85', 'eighty-six': '86',
    'eighty-seven': '87', 'eighty-eight': '88', 'eighty-nine': '89', 'ninety-one': '91',
    'ninety-two': '92', 'ninety-three': '93', 'ninety-four': '94', 'ninety-five': '95',
    'ninety-six': '96', 'ninety-seven': '97', 'ninety-eight': '98', 'ninety-nine': '99'
  };

  // Check if any correct answer is a number word that matches the user's digit
  for (const correctAns of correctAnswers) {
    if (numberMap[correctAns] === userAnswerClean) {
      return { isCorrect: true, missingAccents: false };
    }

    // Handle compound English numbers like "thirty four" (without hyphen)
    const compoundMatch = correctAns.match(/^(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)\s+(one|two|three|four|five|six|seven|eight|nine)$/);
    if (compoundMatch) {
      const tens = numberMap[compoundMatch[1]] || '0';
      const ones = numberMap[compoundMatch[2]] || '0';
      const compoundValue = (parseInt(tens) + parseInt(ones)).toString();
      if (compoundValue === userAnswerClean) {
        return { isCorrect: true, missingAccents: false };
      }
    }
  }

  // Also check the reverse: if user types a number word and answer is a digit
  const reverseNumberMap: Record<string, string[]> = {};
  Object.entries(numberMap).forEach(([word, digit]) => {
    if (!reverseNumberMap[digit]) {
      reverseNumberMap[digit] = [];
    }
    reverseNumberMap[digit].push(word);
  });

  for (const correctAns of correctAnswers) {
    if (reverseNumberMap[correctAns]?.includes(userAnswerClean)) {
      return { isCorrect: true, missingAccents: false };
    }

    // Handle compound numbers in user input like "thirty four" when answer is "34"
    const userCompoundMatch = userAnswerClean.match(/^(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)[\s-]+(one|two|three|four|five|six|seven|eight|nine)$/);
    if (userCompoundMatch) {
      const tens = numberMap[userCompoundMatch[1]] || '0';
      const ones = numberMap[userCompoundMatch[2]] || '0';
      const compoundValue = (parseInt(tens) + parseInt(ones)).toString();
      if (compoundValue === correctAns) {
        return { isCorrect: true, missingAccents: false };
      }
    }
  }

  return { isCorrect: false, missingAccents };
};
