select t.route_id as route, t.id as train, s2.commercial_name as station, round(avg(s.arrival_delay)) as arrival_delay, round(avg(s.departure_delay)) as departure_delay
from trains t inner join public.stops s on t.id = s.train_id inner join public.stations s2 on s2.id = s.station_id
group by t.route_id, t.id, s2.commercial_name
order by t.route_id;
