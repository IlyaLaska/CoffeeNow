import { PickType } from '@nestjs/mapped-types';

import { CreateResourceDto } from './create-resource.dto';

export class UpdateResourceDto extends PickType(CreateResourceDto, ['name']) {}
