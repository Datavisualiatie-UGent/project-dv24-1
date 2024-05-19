SELECT
    arrivals.value AS arrival_delay,
    departures.value AS departure_delay,
    CASE WHEN arrivals.station IS NULL
        THEN departures.station
        ELSE arrivals.station
    END AS station,
    CASE WHEN arrivals.day IS NULL
        THEN departures.day
        ELSE arrivals.day
    END AS day,
    CASE WHEN arrivals.hour IS NULL
        THEN departures.hour
        ELSE arrivals.hour
    END AS hour

FROM (
    SELECT
        round(avg(s1.arrival_delay)) as value,
        (extract(dow from s1.arrival) + 6) % 7 as day,
        extract(hour from s1.arrival) as hour,
        s1.station_id as station

    FROM
        public.stops s1

    WHERE s1.arrival_delay NOTNULL

    GROUP BY day, hour, station_id
) AS arrivals

FULL JOIN (
    SELECT
        round(avg(s1.departure_delay)) as value,
        (extract(dow from s1.departure) + 6) % 7 as day,
        extract(hour from s1.departure) as hour,
        s1.station_id as station

    FROM
        public.stops s1

    WHERE s1.departure_delay NOTNULL

    GROUP BY day, hour, station_id
) AS departures

ON
    arrivals.day = departures.day AND
    arrivals.hour = departures.hour AND
    arrivals.station = departures.station;