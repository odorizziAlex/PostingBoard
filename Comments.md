# Kommetare

Es wurden alle von uns beschriebenen Features erstellt. Zudem auch das von Herren Bazo vorgeschlagene Feature, die .ics Datei mit den Postdaten senden zu können. Ein weiteres zusätzliches Feature ist die Liste der angezeigten Posts zeitlich zu sortieren und nicht nur nach Eigenschaften zu filtern. Außerdem wird die Anzahl der Likes für jeden Post angezeigt, was wiederrum ein zusätzliches Feature ist.

- Zusätzliche Features: #1 Zeitliches sortieren geht jetzt nicht nur nach dem als nächstes stattfindenden Post, sondern auch danach, welcher Post als erstes erstellt wurde, und welcher Post die meisten Favoriserungen hat. #2 Die Anzahl der Favorisierungen eines Posts wird neben dem Favorisierungsbutton angezeigt.

- Zu Datenbankanfragen allgemein: Wir haben uns mit dem Thema der Ladezeit auseinander gesetzt und letztendlich beschlossen, dass wir es für sinnvoller erachten Anfangs eine längere Ladezeit in Kauf zu nehmen, sodass während der Benutzung kaum Ladezeit beanspruncht wird.

- Issue #5: Plakat nach Zeitraum Filtern: Wir haben letztendlich die möglichkeit nach Zeitraum zu filtern nicht implementiert. Stattdessen kann man nun nach einem einzelnen Datum Filtern. Dadurch, dass alle Posts eine Zeitraum-Anganbe beinhalten, werden nun alle Posts gezeigt, dessen Laufzeit sich mit dem ausgewählten Datum überschneiden. Beispiel: Wählt man als Filterdatum den 15. September aus und der angegebene Zeitraum eines Posts geht vom 10. September bis 20. September, wird dieser Post auf der Plattform angezeigt.

- Issue #7: Plakate automatisch löschen: Mit löschen nach einem Tag ist gemeint, 00 Uhr des auf den Ablauftag folgenden Tages.

- Issue #8: Plakate merken: Die Merken Funktion ist zur "Favorisieren" umgeändert, ist aber im Grunde das gleiche

- Issue #9: Plakate nach Zeitraum ordnen: Wurde erweitert mit "neueste zuerst" und "beliebteste zuerst"

- Issue #10: Refresh der Seite durch Klick aufs Logo: Durch den Klick aufs Logo werden alle Posts durchgemischt und ggf. neue geladen. Allerdings ist es im Issue etwas missverständlich formuliert: Es werden nicht die neu erschienenen zuerst gezeigt. Es werden möglicheriweise durch die Zufallsfunktion die neuen Posts, oder noch nicht entdeckte Posts gezeigt. Um die neu hochgeladenen Posts zu sehen, ist die Filterfunktion "neueste zuerst" implementiert worden.

- Issue #12: Preview durch Hoverfunktion: Der Fakultätspunkt wurde durch ein farbiges Overlay ersetzt. So hat jetzt das Overlay die Farbe der zugehörigen Fakultät.

- Issue #17: Passwort ändern: Firebase ermöglicht es nicht auf die Passwörter der Nutzer über eine einfache Schnittstelle zugreifen zu können. Daher wird bei dem Ändern des Passwortes das alte Passwort nicht abgefragt.

Arbeitsaufteilung:
In dem Readme.md wurden die Komponenten erwähnt, bei denen das jeweilige Gruppenmitglied masgebliche Arbeit geleistet hat. Allgemein ist zu erwähnen, dass wir die Entwicklung der App hauptsächlich per Pair-Programming durchgeführt haben. Somit überschneiden sich die Bereiche an denen jedes Gruppenmitglied gearbeitet hat.

## Features, deren Implementierung von dem jeweiligen Gruppenmitglied geleitet wurde:

### Alex Odorizzi:
  * Gesamter Kalender
  * Nach eigenen Posts filtern
  * Nach Favoriten filtern
  * Detailansicht der Posts
  * Posts bearbeiten
  * Posts löschen
  * Posts favorisieren
  * Posts versenden
  * Verbindungsprobleme handhaben
  * Shortcuts, wie das Klicken auf Overlays, bestätigen mit "Enter", oder abbrechen  mit "ESC" verwenden zu können
  * Cookies
  * Zweites und drittes Level an Overlays und dazugehörige Logik

### Timo Krapf:
  * Upload der Posts
  * Anzeigen der Posts im Postingboard
  * Nach Zeitpunkt, Fakultät, Kategorie und Reihenfolge filtern (Filterungslogik)
  * Komprimieren der Bilder für Posts
  * Speichern, Bearbeiten und Löschen von Posts in der Datenbank
  * "Neue Posts"-Button, falls ein fremder Post hinzugefügt wird, während man die  App nutzt
  * Umgang mit Datenbank, falls ein User gelöscht wird
  * Vollansicht der Post-Bilder
  * Löschen von Posts, falls der Zeitraum vorbei ist
  * Refresh und zufällige Anordung, wenn User aufs Logo klickt
  * "Weitere Posts anzeigen"-Button und Logik dahinter
  * Shortcuts

### Markus Bink:
* User Interface der App
* Registrierung von Usern
* Login von Usern
* Logout von Usern
* Löschen des Profils
* Profilinformation anpassen
* Neues Passwort anfordern, falls vergessen
* Toast Messages für User-Benachrichtigungen 
  