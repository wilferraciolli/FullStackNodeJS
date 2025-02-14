import { Injectable } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Repository } from 'typeorm';
import { Asset } from './entities/asset.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset) private assetRepository: Repository<Asset>,
  ) {}

  async create(createAssetDto: CreateAssetDto) {
    const asset = this.assetRepository.create(createAssetDto);

    return this.assetRepository.save(asset);
  }

  findAll() {
    return this.assetRepository.find();
  }

  findOne(id: number) {
    return this.assetRepository.findOne({ where: { id } });
  }

  update(id: number, updateAssetDto: UpdateAssetDto) {
    return this.assetRepository.update(id, updateAssetDto);
  }

  remove(id: number) {
    return this.assetRepository.delete(id);
  }
}
