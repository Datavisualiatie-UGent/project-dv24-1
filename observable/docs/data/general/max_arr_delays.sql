select s2.commercial_name as station, max(s.arrival_delay) / 60 as max_delay
from stops s inner join public.stations s2 on s2.id = s.station_id
where s2.commercial_name not ilike '%bundel%' and s2.commercial_name not ilike '%groep%'
  and s2.commercial_name not ilike '%D.O.P%' and s2.commercial_name not ilike '%carwash%'
  and s.arrival_delay / 60 > 0
group by s2.commercial_name
order by max_delay;
