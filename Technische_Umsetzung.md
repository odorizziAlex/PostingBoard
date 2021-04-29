# PostingBoard

## Technische Umsetzung

| Bibliothek/API | Beschreibung |
|---------|--------------|
| **Firebase** | Firebase von Google wird verwendet, um die gesamte Nutzerverwaltung zu ermöglichen, sei es Registierung, Einloggen, Passwort vergessen etc. Ferner verwenden wir Firebase, um unsere Informationen über einzelne Posts persistent und sessionübergreifend zu speichern. |
| **ImageCompressor** | ImageCompressor von npm wird verwendet, um die Bilder beim Hochladen zu komprimieren und somit den Speicherbedarf auf unserer Datenbank so gering wie möglich zu halten. |
| **ICS** | ICS  wird verwendet, um dem Nutzer es zu ermögliche, einen beliebigen Post mit den nötigen Informationen als .ics-Datei herunterzuladen. |