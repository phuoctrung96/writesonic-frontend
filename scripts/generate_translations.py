import json

import requests



languages_to_transalate = ["de", "es", "fr", "it", "pl", "pt-pt", "ru"]
base_path = "locales"
# file name to be processed, keep new entries in en/file and run this script
# this would add the translated entries to other files
file_name = "inputs.json"
english_file = open(f"{base_path}/en/{file_name}", encoding="utf-8")
english_json = json.load(english_file)


def get_translation(language, text):
    data = {
        "auth_key": "f7ffe6c8-0cfa-08db-eded-6860de58ec60",
        "text": text,
        "target_lang": (language).upper(),
    }
    try:
        response = requests.post("https://api.deepl.com/v2/translate", data=data)
        translated_text = json.loads(response.text)["translations"][0]["text"]
        print(translated_text)
        return translated_text
    except Exception as e:
        print(e)


for language in languages_to_transalate:
    language_file = open(f"{base_path}/{language}/{file_name}", "r+", encoding="utf-8")
    language_json = json.load(language_file)
    language_file.close()
    for item in english_json.items():
        if item[0] in language_json:
            pass
        else:
            translation_text  = get_translation(language, item[1])
            if translation_text is not None:
                language_json[item[0]] = translation_text
            
    out_file = open(f"{base_path}/{language}/{file_name}", "w", encoding="utf-8")
    json.dump(language_json, out_file, ensure_ascii=False, indent=4)
    out_file.close()
