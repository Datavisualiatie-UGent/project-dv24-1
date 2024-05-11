# Verslag

## Dataverwerking

Infrabel voorziet een ruwe datadump met daarin iedere aankomst en ieder vertrek van een trein in een Belgisch station, inclusief de afwijkingen van de geplande tijdstippen in seconden.

Deze data is omvangrijk. Een enkele maand komt overeen met een tekstbestand in het CSV-formaat van ruwweg 300 megabyte, goed voor zo'n twee miljoen datapunten.

Om deze data efficient te verwerken schreven we een Golang programma om de CSV-bestanden in te laden, structuur aan te brengen, en in een PostgreSQL databank te laden.

De queries die we wensen uit te voeren om data te verkrijgen om de grafieken weer te geven, zijn gedefinieerd in `./observable/docs/data`.

### Motivatie

#### Direct gebruik van de datasets

Het is in de praktijk onmogelijk om de ruwe data rechtstreeks aan te spreken bij het compileren van de Observable Framework website.

De bestandsgrootte is de eerste limiterende factor, en maakt het moeilijk om de static-site-generator als DevOps dienst in te zetten om automatisch in te zetten via GitHub Pages. We zouden namelijk gigabytes aan data aan het versiebeheersysteem moeten toevoegen, of deze herhaaldelijk moeten downloaden van Infrabel's API.

Het gebrek aan structuur vormt ook een probleem. Stel dat we alle datapunten voor een station zoals "Gent Sint-Pieters" wensen te vinden. We kunnen hier geen gebruik maken van identifiers, want deze zijn afwezig in de CSV-bestanden. We moeten dus rij-per-rij een string-match algoritme uitvoeren met complexiteit $O(n)$. Het process wordt dus bijzonder traag.

#### Preprocessing

De SQL queries die uitgevoerd worden om de resulterende grafiekdata te verkrijgen zijn geen deel van de static-site-generator zelf, voor vele van dezelfde redenen als hierboven. We zouden hiervoor namelijk een draaiende PostgreSQL databank moeten voorzien tijdens het genereren, wat onmogelijk is zonder eerst de ruwe data zelf te verkrijgen uit het versiebeheersysteem of de data. We kiezen ervoor om niet te steunen op externe databank.

Onze oplossing is dus eenvoudigweg de SQL queries uitvoeren tijdens het ontwikkelen, en het resultaat als CSV-bestand opslaan en toevoegen aan Git.

#### Online filteren

Stel dat we data wensen te generen die de gemiddelde vertraging per kalendardag, per station beschrijft. We kiezen ervoor om een enkel CSV-bestand te genereren en op te slaan, en de correcte waarden *client-side* te filteren.

```csv
STATION;VERTRAGING_AANKOMST;VERTRAGING_VERTREK;KALENDERDAG
455;    100;                40;                2023-01-01
242;    152;                64;                2023-01-01
...     ...                 ...                ...
```

Een performantere werkwijze staat Observable Framework niet toe.

Een eerste methode splitst de data op per station, waarbij we voor $n$ stations dus ook $n$ CSV-bestanden genereren. Deze zijn individueel relatief klein, en kunnen eenvoudig opgevraagd worden door de browser. Helaas is het niet mogelijk, want de `FileAttachment` API verwacht een *compile-time string literal*, waardoor het volgende onmogelijk is.

```ts
const stationIdentifier = view(Inputs.select(stations));

// Throws an compile-time string literal error.
const data = await FileAttachment(`./data/${stationIdentifier}`);
```

Hetzelfde geldt voor de ingebouwde DuckDB connector, waar SQL queries geen variabelen mogen bevatten.

### Conclusie

De limitaties van het Observable Framework wegen sterk door, en beperken onze visualisatiemogelijkheden aanzienlijk. Het resultaat is dan ook een statische website met een suboptimale performantie, die grotendeels vermeden kon worden met ondersteuning voor *URL slug entries*, net zoals bij [SvelteKit](https://kit.svelte.dev/docs/page-options#entries).

Het gebruik van Observable Framework voor een dataset die even omvangrijk en relationeel is als die van Infrabel lijkt ons dan ook geen goede keuze.

## Visualisaties
