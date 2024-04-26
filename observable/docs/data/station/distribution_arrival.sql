SELECT
    count(round(s1.arrival_delay / 60)) as count,
    round(s1.arrival_delay / 60) as delay

FROM
    public.stops s1

WHERE s1.station_id = 455
  AND s1.arrival_delay NOTNULL
  AND round(s1.arrival_delay / 60) < 60
  AND round(s1.arrival_delay / 60) > -5

GROUP BY round(s1.arrival_delay / 60);
