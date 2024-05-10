select s2.commercial_name as station, avg(s.arrival_delay) / 60 as avg_delay
from stops s inner join public.stations s2 on s2.id = s.station_id
where s2.commercial_name not ilike '%bundel%' and s2.commercial_name not ilike '%groep%'
  and s2.commercial_name not ilike '%D.O.P%' and s2.commercial_name not ilike '%carwash%'
group by s2.commercial_name
order by avg_delay;
