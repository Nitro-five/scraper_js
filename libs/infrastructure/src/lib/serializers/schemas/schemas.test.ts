import digitalWires from './digitalwires.avsc.json';
import { Schema, Type } from 'avsc';
import { DigitalwiresWrapperSchema } from './types';

describe('Schemas', () => {
  it('should validate ethalon data toward Digitalwires schema', () => {
    const schema = Type.forSchema(digitalWires as Schema);
    const errors: { path: string[]; val: any; type: Type }[] = [];
    const errorHook = (path: string[], val: any, type: Type) => errors.push({ path, val, type });
    schema.isValid(
      {
        asb_meta: {
          debugging_meta: {
            creditline:
              'https://www.bonus.com/news/sanborn-appeals-concord-casino-case-to-state-supreme-court/',
            headline: 'titleMock',
            source_article_url:
              'https://www.bonus.com/news/sanborn-appeals-concord-casino-case-to-state-supreme-court/',
            urn: 'urn:usj:bonus.com:/news/sanborn-appeals-concord-casino-case-to-state-supreme-court',
          },
        },
        digitalwires: {
          article_html: '<div>Full article content</div>',
          associations: [
            {
              'de.aussiedlerbote.digitalwires.avro.ImageAssociationSchema': {
                rank: 0,
                renditions: [
                  {
                    url: 'https://www.bonus.com/wp-content/uploads/2021/01/Depositphotos_67027773_xl-2015-768x512.jpg.webp',
                  },
                ],
                urn: '59307d047e2728fd0ee3b7d64ff4419fe7051f7b',
                caption:
                  '2021 is upon us, which means new states might begin to legalize sports betting. Which states are on the cusp?',
                type: 'image',
              },
            },
          ],
          categories: [],
          creditline:
            'https://www.bonus.com/news/sanborn-appeals-concord-casino-case-to-state-supreme-court/',
          current_rubric_names: [
            'https://www.bonus.com/news/sanborn-appeals-concord-casino-case-to-state-supreme-court/',
          ],
          dateline: '2025-01-01T00:00:00+00:00',
          descriptions: [
            {
              description: 'titleMock',
              role: 'title',
            },
            {
              description: 'teaserMock',
              role: 'description',
            },
          ],
          genre_names: ['news'],
          headline: 'titleMock',
          keyword_names: [],
          language: 'en',
          pubstatus: 'usable',
          rubric_names: [
            'https://www.bonus.com/news/sanborn-appeals-concord-casino-case-to-state-supreme-court/',
          ],
          teaser: 'teaserMock',
          updated: '2025-01-01T00:00:00+00:00',
          urn: 'urn:usj:bonus.com:/news/sanborn-appeals-concord-casino-case-to-state-supreme-court',
          version: 1,
          version_created: '2025-01-01T00:00:00+00:00',
          entry_id: 'aba7634df34egad3',
        },
      } satisfies DigitalwiresWrapperSchema,
      { errorHook }
    );
    expect(errors).toEqual([]);
  });

  it('should validate ethalon image association data toward Digitalwires schema', () => {
    const schema = Type.forSchema({
      type: 'record',
      name: 'DigitalwiresWrapperSchema',
      namespace: 'de.aussiedlerbote.digitalwires.avro',
      fields: [
        {
          name: 'associations',
          type: {
            type: 'array',
            items: [
              {
                type: 'record',
                name: 'ImageAssociationSchema',
                fields: [
                  {
                    name: 'rank',
                    type: 'int',
                  },
                  {
                    name: 'renditions',
                    type: {
                      type: 'array',
                      items: {
                        type: 'record',
                        name: 'RenditionSchema',
                        fields: [
                          {
                            name: 'url',
                            type: 'string',
                          },
                          {
                            name: 'fovealarea',
                            type: [
                              'null',
                              {
                                type: 'record',
                                name: 'FovealareaSchema',
                                fields: [
                                  {
                                    name: 'bottom',
                                    type: ['null', 'int'],
                                    default: null,
                                  },
                                  {
                                    name: 'left',
                                    type: ['null', 'int'],
                                    default: null,
                                  },
                                  {
                                    name: 'right',
                                    type: ['null', 'int'],
                                    default: null,
                                  },
                                  {
                                    name: 'top',
                                    type: ['null', 'int'],
                                    default: null,
                                  },
                                ],
                                doc: 'Avro schema class for Fovealarea',
                              },
                            ],
                            default: null,
                          },
                          {
                            name: 'height',
                            type: ['null', 'int'],
                            default: null,
                          },
                          {
                            name: 'mimetype',
                            type: ['null', 'string'],
                            default: null,
                          },
                          {
                            name: 'size',
                            type: ['null', 'int'],
                            default: null,
                          },
                          {
                            name: 'width',
                            type: ['null', 'int'],
                            default: null,
                          },
                        ],
                        doc: 'Avro schema class for Rendition',
                      },
                      name: 'rendition',
                    },
                  },
                  {
                    name: 'type',
                    type: 'string',
                  },
                  {
                    name: 'urn',
                    type: 'string',
                  },
                  {
                    name: 'caption',
                    type: ['null', 'string'],
                    default: null,
                  },
                  {
                    name: 'creditline',
                    type: ['null', 'string'],
                    default: null,
                  },
                  {
                    name: 'headline',
                    type: ['null', 'string'],
                    default: null,
                  },
                  {
                    name: 'is_featureimage',
                    type: ['null', 'boolean'],
                    default: null,
                  },
                  {
                    name: 'version',
                    type: ['null', 'int'],
                    default: null,
                  },
                  {
                    name: 'version_created',
                    type: ['null', 'string'],
                    default: null,
                  },
                ],
                doc: 'Avro schema class for ImageAssociation',
              },
              {
                type: 'record',
                name: 'Txt2ImgAssociationSchema',
                fields: [
                  {
                    name: 'rank',
                    type: 'int',
                  },
                  {
                    name: 'type',
                    type: 'string',
                  },
                  {
                    name: 'urn',
                    type: 'string',
                  },
                  {
                    name: 'prompt',
                    type: 'string',
                  },
                  {
                    name: 'renditions',
                    type: [
                      'null',
                      {
                        type: 'array',
                        items: 'RenditionSchema',
                        name: 'rendition',
                      },
                    ],
                    default: null,
                  },
                  {
                    name: 'caption',
                    type: ['null', 'string'],
                    default: null,
                  },
                  {
                    name: 'creditline',
                    type: ['null', 'string'],
                    default: null,
                  },
                  {
                    name: 'headline',
                    type: ['null', 'string'],
                    default: null,
                  },
                  {
                    name: 'is_featureimage',
                    type: ['null', 'boolean'],
                    default: null,
                  },
                  {
                    name: 'version',
                    type: ['null', 'int'],
                    default: null,
                  },
                  {
                    name: 'version_created',
                    type: ['null', 'string'],
                    default: null,
                  },
                ],
                doc: 'Avro schema class for Txt2ImgAssociation',
              },
            ],
            name: 'association',
          },
        },
      ],
    } satisfies Schema);

    const errors: { path: string[]; val: any; type: Type }[] = [];
    const errorHook = (path: string[], val: any, type: Type) => errors.push({ path, val, type });
    schema.isValid(
      {
        associations: [
          {
            'de.aussiedlerbote.digitalwires.avro.ImageAssociationSchema': {
              rank: 0,
              renditions: [
                {
                  url: 'https://www.bonus.com/wp-content/uploads/2021/01/Depositphotos_67027773_xl-2015-768x512.jpg.webp',
                },
              ],
              urn: '59307d047e2728fd0ee3b7d64ff4419fe7051f7b',
              caption:
                '2021 is upon us, which means new states might begin to legalize sports betting. Which states are on the cusp?',
              type: 'image',
            },
          },
        ],
      },
      { errorHook }
    );
    expect(errors).toEqual([]);
  });
});
