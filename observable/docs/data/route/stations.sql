select t.route_id as route, s.train_id as train, s2.commercial_name as station, s2.latitude, s2.longitude
from stops s inner join public.stations s2 on s2.id = s.station_id inner join public.trains t on t.id = s.train_id
where (s.departure between '2023/1/5' and '2023/1/6' or s.arrival between '2023/1/5' and '2023/1/6')
order by s.departure;
