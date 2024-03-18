import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsArray, IsDecimal, IsDate, IsNotEmpty, IsOptional, IsDateString, IsBoolean } from 'class-validator';
import { IsTimeFormat } from 'src/shared/decorator/validator';

export class UpdateTrainingLogDto {


  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  modelId?: number;
    


  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  promptId?: number;
    


  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  datasetId?: number;
    


  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  gpuInstanceId?: number;
    


  @ApiProperty({ required: false })
  @IsOptional()
  status?: string;
    

  

  
}
