import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsArray, IsDecimal, IsDateString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { IsTimeFormat } from 'src/shared/decorator/validator';

export class CreatePromptDto {
  

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  promptText: string;
  
  

  

}
