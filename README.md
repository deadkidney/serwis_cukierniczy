# Serwis cukierniczy

## Instalacja
Przed instalacją należy mieć zainstalowane i skonfigurowane narzędzia *Node.js* v24.15.0 (wraz z *npm* v11.13.0) oraz *postgreSQL* v18.6.
	
Pliki projektu można uzyskać klonując repozytorium  <https://github.com/deadkidney/serwis_cukierniczy>.
	
Instalacji wymaganych pakietów należy dokonać uruchamiając polecenie
```npm install```
w katalogu `server/` oraz ponownie w katalogu `client/`.

### Konfiguracja bazy danych
W celu konfiguracji bazy danych, należy stworzyć nową bazę danych a następnie w głównym katalogu projektu uruchomić polecenie 
```
psql -U Uzytkownik -d BazaDanych -f "exampleDB.sql"
```
z odpowiednią nazwą użytkownika i bazy danych. 
Potem, należy uzupełnić w pliku `server/config.json` dane dotyczące bazy danych: nazwą stworzonej bazy, nazwą i hasłem użytkownika oraz numerem portu. Ponadto należy uzupełnić klucz kryptograficzny dla tokenów JWT. Skonfigurowana właśnie przykładowa baza danych jest zgodna z kluczem `"example secret"`. Plik `server/config.json` powinien wyglądać na przykład tak:
```
{
	"dbConfig": {
		"user": "postgres",
		"host": "localhost",
		"database": "przykladowaBaza",
		"password": "haslo",
		"port": 5432
	},
	"JWT_SECRET": "example secret",
	"BCRYPT_SALT": 10
}
```
 	 
Zamiast ładować przykładową bazę danych, można stworzyć pustą (z dokładnością do tagów) bazę poleceniem:
```
psql -U Uzytkownik -d BazaDanych -f "emptyDB.sql"
```
Wtedy również należy uzupełnić plik `server/config.json`, tym razem używając dowolnego klucza kryptograficznego.
	
### Uruchomienie
Aby uruchomić serwery należy wykonać w katalogu `client/` polecenie 
```
npm run build
```
a następnie uruchomić polecenie
```
npm run start
```
równolegle w katalogach `client/` oraz `server/`.

Następnie należy otworzyć w przeglądarce link <http://localhost:5173>. 

## Testy
Aby uruchomić testy jednostkowe serwera (backend) należy najpierw stworzyć nową bazę danych i skonfigurować ją poleceniem:
```
psql -U Uzytkownik -d BazaDanych -f "testDB.sql"
```
a następnie uzupełnić plik `server/tests/mock.config.json`. Testowa baza danych jest zgodna z kluczem `"test secret"`. Do testów można użyć dowolnej innej bazy danych, która posiada użytkowników o *id* 1,2 oraz 3, jednak niepowodzenie testów może skutkować wprowadzeniem w niej zmian.
	
Porcedurę testową można uruchomić poleceniem 
```
npm run test
```
w katalogu `server/`.