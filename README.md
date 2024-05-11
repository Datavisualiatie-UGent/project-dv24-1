# Regular Express

[![Deploy to GitHub Pages](https://github.com/Datavisualiatie-UGent/project-dv24-1/actions/workflows/pages.yml/badge.svg)](https://github.com/Datavisualiatie-UGent/project-dv24-1/actions/workflows/pages.yml)

## Description

This repository contains the source code for the Regular Express project, a project for the course datavisualisation at Ugent 2023-2024, which aims to provide a comprehensive analysis of train delays in Belgium. The project uses data provided by Infrabel ([dataset](https://opendata.infrabel.be/explore/dataset/ruwe-gegevens-van-stiptheid-d-1/information/?disjunctive.train_no&disjunctive.relation&disjunctive.train_serv&disjunctive.line_no_dep&disjunctive.relation_direction&disjunctive.ptcar_lg_nm_nl&disjunctive.line_no_arr)) to generate insights and visualizations that can be used to improve the efficiency of the Belgian railway system.

### Project Goals

The goals we aim to achieve with this project fall into several categories:

- **Insights into Delay Locations**: Provide users with insights into where delays occur, and potentially why they occur, such as at busy stations or during construction works.
  
- **Analysis of Delay Durations**: Offer users insights into the average duration of delays based on the time of day or day of the week.

- **Multi-level Insights**: Provide insights at three different levels:
  - For specific stations.
  - For given routes (e.g., Brussels to Ghent).
  - For the entire network, facilitating comparison of station properties.

### Results

The website contains 3 pages filled with different types of graphs. Here one page is provided for the categories described above in Multi-Level Insights.
Some graphs are similar throughout these pages but this makes it useful to view different data in the same way to create comparisons. More details of what the graphs mean and represent can be found on the pages themselves.

## Table of Contents

1. [Frameworks](#frameworks)
2. [Contributions](#contributions)
3. [Directory Structure](#directory-structure)
4. [Installation](#installation)
5. [Usage](#usage)
6. [License](#license)

## Frameworks

The project comprises two main parts:

- **Database Setup**: Due to the large size of the data files, it's not feasible to download and run them locally. Therefore, we've set up a PostgreSQL database in Go to store the data obtained from Infrabel ([dataset](https://opendata.infrabel.be/explore/dataset/ruwe-gegevens-van-stiptheid-d-1/information/?disjunctive.train_no&disjunctive.relation&disjunctive.train_serv&disjunctive.line_no_dep&disjunctive.relation_direction&disjunctive.ptcar_lg_nm_nl&disjunctive.line_no_arr)). This database is utilized for data storage and SQL queries. During the development phase, we hosted this database live on our server to expedite development.

- **Website Implementation**: The website is built using the Observable framework, providing interactive and dynamic visualizations for users to explore and analyze train delay data.

## Contributions

Contributors to this project include:

* [Janne Cools](https://github.com/JanneCools)
* [Jens Pots](https://github.com/jenspots)
* [Lander Durie](https://github.com/landerdurie)

## Directory Structure

Bots parts described in [Frameworks](#frameworks), can be found in the following directories:
- **Database Setup**: The database setup is located in the `golang` directory.
- **Website Implementation**: The website implementation is located in the `observable` directory.

More details about the project structure can be found in the respective directories.

## Installation

To set up the project locally, follow these steps:

### Database

This step is optional, but required if you wish to create new data files or update existing ones. If you merely want to update existing graphs, or preview the website locally, the CSV files included in the repository will suffice. We expect you to have Golang and Docker with Docker Compose installed. 

1. **Retrieve Raw Data**: Execute the [`fetch.sh`](./golang/data/fetch.sh) script in order to retrieve all data from 2023. We do so using the `limit` and `offset` URL parameters, so if you wish, you could change these in order to retrieve another selection of datasets.

2. **Initialize Database**: All required services are provided in a [Docker Compose](./golang/docker-compose.yml) file. Simply execute `docker compose up`.

3. **Execute the data parser and ingestion**: In the [`golang`](./golang) directory, execute `go run . ./data` where `./data` refers to the directory into which you have saved the previously retrieved datasets. Here, the Go compiler is automatically invoked and applies the database schema to PostgreSQL.

Note that data ingestion takes a while due to the sheer size of  the datasets. During ingestion, the console output will inform you on the progress.

### Observable Framework

1. **Clone the Repository**: Clone this repository to your local machine using Git.
   
2. **Navigate to Project Directory**: Open a terminal and navigate to the project directory.
   
3. **Install Dependencies**: Run `npm install` to install all project dependencies.

## Usage

Once the project is set up, you can perform various tasks, including data analysis, visualization, and documentation generation. Here are some common commands:

- `npm start`: Start the development server.
- `npm run build`: Build the project for production.
- `npm run analyze`: Analyze data and generate insights.
- `npm run visualize`: Visualize data using graphs and charts.
- `npm run docs`: Generate documentation.

Visit <http://localhost:3000> to preview the project once it is running.

## License

This project is licensed under the [MIT License](LICENSE).
