import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GeoJsonObject } from 'geojson';
import { CityDistanceDto } from 'src/DTO/cityDistance.dto';
import { City } from 'src/Domain/city.model';
import { Repository } from 'typeorm';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City, 'DisasterDb')
    private readonly cityRepository: Repository<City>,
  ) {}

  async findNearestTown(
    geometry: GeoJsonObject,
    distanceMin: number = 2688221,
  ): Promise<CityDistanceDto> {
    const nearestCity = await this.cityRepository.query(`
SELECT c.namefr as ville, countries.namefr as pays, ST_Distance(ST_GeomFromGeoJSON('${JSON.stringify(geometry)}')::geography, c.geom)/1000 as distance
    FROM cities c LEFT JOIN countries on countries.id = c."paysId" WHERE ST_DWithin(ST_GeomFromGeoJSON('${JSON.stringify(geometry)}')::geography, c.geom::geography, ${distanceMin}) ORDER BY ST_Distance(ST_GeomFromGeoJSON('${JSON.stringify(geometry)}')::geography, c.geom::geography) LIMIT 1;
`);

    const city = {
      ville: nearestCity[0].ville,
      distance: nearestCity[0].distance,
      pays: nearestCity[0].pays,
    };

    return city;
  }
}
