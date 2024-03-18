import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsArray, IsDecimal, IsDateString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { IsTimeFormat } from 'src/shared/decorator/validator';

export class CreateTrainingLogDto {
  

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  modelId: number;
  
  

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  promptId: number;
  
  

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  datasetId: number;
  
  

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  gpuInstanceId: number;
  
  

  @ApiProperty()
  @IsNotEmpty()
  status: string;
  
  

  

}
