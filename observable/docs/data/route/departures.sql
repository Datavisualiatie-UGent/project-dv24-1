select t.route_id as route, t.id as train, min(s.departure) as departure
from trains t inner join public.stops s on t.id = s.train_id inner join public.stations s2 on s2.id = s.station_id
group by t.id, t.route_id
order by departure;
