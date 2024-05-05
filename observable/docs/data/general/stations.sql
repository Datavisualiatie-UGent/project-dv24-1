select distinct commercial_name as station, latitude, longitude
from stations s inner join public.stops s2 on s.id = s2.station_id
order by commercial_name;
