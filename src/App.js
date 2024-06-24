import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const supportedLanguages = [
  { code: 'af', name: 'Afrikaans' },
  { code: 'sq', name: 'Albanian' },
  { code: 'am', name: 'Amharic' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'mr', name: 'Marathi' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
];

const defaultUiText = {
  title: 'Google Translate App',
  placeholder: 'Enter text to translate...',
  selectLanguage: 'Select Language:',
  translateButton: 'Translate',
  translating: 'Translating...',
  translatedText: 'Translated Text:'
};

const TranslationApp = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [uiText, setUiText] = useState(defaultUiText);
  const [translatedLanguages, setTranslatedLanguages] = useState(supportedLanguages);
  const [uiLanguage, setUiLanguage] = useState('en');  // Default UI language

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const translateText = async () => {
    setLoading(true);
    const sentences = inputText.split('. ');
    let translatedSentences = [];

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim();
      if (sentence) {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${selectedLanguage}&dt=t&q=${encodeURIComponent(
          sentence
        )}`;

        try {
          const response = await axios.get(url);
          const translatedSentence = response.data[0][0][0];
          translatedSentences.push(translatedSentence);
        } catch (error) {
          console.error('Error translating sentence:', error);
          translatedSentences.push(sentence);
        }
      }
    }

    setTranslatedText(translatedSentences.join('. '));
    setLoading(false);
  };

  const translateUiText = async (targetLanguage) => {
    setLoading(true);
    const textKeys = Object.keys(defaultUiText);
    let translatedUiText = {};

    // Translate UI text
    for (let key of textKeys) {
      const text = defaultUiText[key];
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(
        text
      )}`;

      try {
        const response = await axios.get(url);
        translatedUiText[key] = response.data[0][0][0];
      } catch (error) {
        console.error('Error translating UI text:', error);
        translatedUiText[key] = text;
      }
    }

    // Translate language names
    let translatedLangNames = [];
    for (let lang of supportedLanguages) {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(
        lang.name
      )}`;

      try {
        const response = await axios.get(url);
        translatedLangNames.push({ code: lang.code, name: response.data[0][0][0] });
      } catch (error) {
        console.error('Error translating language name:', error);
        translatedLangNames.push(lang);
      }
    }

    setUiText(translatedUiText);
    setTranslatedLanguages(translatedLangNames);
    setUiLanguage(targetLanguage);
    setLoading(false);
  };

  return (
    <div className="container mx-auto mt-10">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex justify-end p-4">
          {supportedLanguages.map(lang => (
            <button
              key={lang.code}
              className="mx-1 px-2 py-1 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out"
              onClick={() => translateUiText(lang.code)}
            >
              {lang.code.toUpperCase()}
            </button>
          ))}
        </div>
        <h2 className="bg-gray-200 text-gray-800 text-lg font-semibold py-4 px-6">{uiText.title}</h2>
        <div className="p-6">
          <textarea
            className="w-full h-32 px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-blue-500 transition duration-300"
            placeholder={uiText.placeholder}
            value={inputText}
            onChange={handleInputChange}
          ></textarea>
          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="language">
              {uiText.selectLanguage}
            </label>
            <select
              id="language"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-blue-500 transition duration-300"
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              <option value="">{uiText.selectLanguage}</option>
              {translatedLanguages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>
          </div>
          <button
            className={`mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={translateText}
            disabled={isLoading || !selectedLanguage}
          >
            {isLoading ? uiText.translating : uiText.translateButton}
          </button>
        </div>
        {translatedText && (
          <div className="bg-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-2">{uiText.translatedText}</h3>
            <p className="text-gray-800">{translatedText}</p>
          </div>
        )}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslationApp;