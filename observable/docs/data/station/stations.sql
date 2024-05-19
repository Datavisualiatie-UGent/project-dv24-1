SELECT
    stations.id as id,
    commercial_name as name,
    latitude,
    longitude,
    count(*) as count
FROM stations

LEFT JOIN public.stops s on stations.id = s.station_id

GROUP BY stations.id, commercial_name, latitude, longitude

HAVING count(*) > 1000
