import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReportDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1886)
  @Max(new Date().getFullYear())
  year: number;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;

  @IsLongitude()
  @IsNumber()
  lng: number;

  @IsLatitude()
  @IsNumber()
  lat: number;

  @IsNumber()
  @IsPositive()
  price: number;
}
