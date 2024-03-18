import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsArray, IsDecimal, IsDateString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { IsTimeFormat } from 'src/shared/decorator/validator';

export class CreateModelDto {
  

  @ApiProperty()
  @IsNotEmpty()
  name: string;
  
  

  @ApiProperty()
  @IsNotEmpty()
  label: string;
  
  

  @ApiProperty()
  @IsNotEmpty()
  huggingfaceId: string;
  
  

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  documentation: string;
  
  

  

}
