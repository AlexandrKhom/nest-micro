import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TagService } from './tag.service';
import { TagRepository } from './tag.repository';

const mockTagRepository = () => ({
  findAllTags: jest.fn(),
  findOneTag: jest.fn(),
});

describe('TasksService', () => {
  let tagService: TagService;
  let tagRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TagService,
        { provide: TagRepository, useFactory: mockTagRepository },
      ],
    }).compile();

    tagService = module.get(TagService);
    tagRepository = module.get(TagRepository);
  });

  describe('getTags', () => {
    it('calls TagRepository.getTags and returns the result', async () => {
      tagRepository.findAllTags.mockResolvedValue('someValue');
      const result = await tagService.findAllTags();
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calls TasksRepository.findOne and returns the result', async () => {
      const mockTag = {
        name: 'nest',
        id: 'someId',
      };

      tagRepository.findOneTag.mockResolvedValue(mockTag);
      const result = await tagService.findOneTag('someId');
      expect(result).toEqual(mockTag);
    });

    it('calls TasksRepository.findOne and handles an error', async () => {
      tagRepository.findOneTag.mockResolvedValue(null);
      // const action = async () => {
      //   await tagService.findOneTag('someId');
      // };
      const result = tagService.findOneTag('someId');
      expect(result).rejects.toThrow(NotFoundException);
    });
  });
});
