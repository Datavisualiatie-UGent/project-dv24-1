#!/usr/bin/env bash

# API parameters
LIMIT=12
OFFSET=108

# Endpoint
URL="https://opendata.infrabel.be/api/explore/v2.1/catalog/datasets/stiptheid-gegevens-maandelijksebestanden/records?limit=${LIMIT}&offset=${OFFSET}&order_by=mois"

# Extract links to various datasets
DATASETS=$(curl -s $URL | jq -r '.results[].link_to_data')

echo "Retrieving the following datasets."

for DATASET in $DATASETS; do
    echo $DATASET
done

echo ""

for DATASET in $DATASETS; do
    wget $DATASET
done
