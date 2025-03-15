// TODO: generate these types from AVSC schema.
// With help of library: https://github.com/bornfight/avro-to-typescript
// But all of theme deprecated and was unpublished from npmjs.
// Find a suitable substitute.

import { readAVSC } from '@kafkajs/confluent-schema-registry';

/**
 * Check fields meanings [here](https://doc.clickup.com/20637277/p/h/kntjx-6275/ccfccf5f56a0115)
 */
export interface FovealareaSchema {
  bottom?: number | null;
  left?: number | null;
  right?: number | null;
  top?: number | null;
}

export interface RenditionSchema {
  url: string;
  fovealarea?: FovealareaSchema | null;
  height?: number | null;
  mimetype?: string | null;
  size?: number | null;
  width?: number | null;
}

export interface ImageAssociationSchema {
  rank: number;
  renditions: RenditionSchema[];
  type: string;
  urn: string;
  caption?: string | null;
  creditline?: string | null;
  headline?: string | null;
  is_featureimage?: boolean | null;
  version?: number | null;
  version_created?: string | null;
}

export interface Txt2ImgAssociationSchema {
  rank: number;
  type: string;
  urn: string;
  prompt: string;
  renditions?: RenditionSchema[] | null;
  caption?: string | null;
  creditline?: string | null;
  headline?: string | null;
  is_featureimage?: boolean | null;
  version?: number | null;
  version_created?: string | null;
}

export interface GenreCategorySchema {
  type: string;
  name: string;
  qcode: string;
}

export interface RubricCategorySchema {
  is_current: boolean;
  name: string;
  qcode: string;
  type: string;
}

export interface DescriptionSchema {
  description: string;
  role: string;
}

export interface EdnoteSchema {
  ednote?: string | null;
  is_publishable?: boolean | null;
  role?: string | null;
}

export interface DigitalwiresSchema {
  article_html: string;
  associations: (
    | { 'de.aussiedlerbote.digitalwires.avro.ImageAssociationSchema': ImageAssociationSchema }
    | { 'de.aussiedlerbote.digitalwires.avro.Txt2ImgAssociationSchema': Txt2ImgAssociationSchema }
  )[];
  categories: (
    | { 'de.aussiedlerbote.digitalwires.avro.GenreCategorySchema': GenreCategorySchema }
    | { 'de.aussiedlerbote.digitalwires.avro.RubricCategorySchema': RubricCategorySchema }
  )[];
  creditline: string;
  current_rubric_names: string[];
  dateline: string;
  descriptions: DescriptionSchema[];
  entry_id: string;
  headline: string;
  keyword_names: string[];
  language: string;
  pubstatus: string;
  rubric_names: string[];
  teaser: string;
  updated: string;
  urn: string;
  version: number;
  autopublishnotice?: string | null;
  byline?: string | null;
  copyrightnotice?: string | null;
  desk_names?: string[] | null;
  dpasubject_names?: string[] | null;
  ednotes?: EdnoteSchema[] | null;
  embargoed?: string | null;
  format?: string | null;
  genre_names?: string[] | null;
  geosubject_names?: string[] | null;
  infobox_html?: string | null;
  kicker?: string | null;
  linkbox_html?: string | null;
  notepad?: string | null;
  poi_names?: string[] | null;
  scope_names?: string[] | null;
  signal?: string | null;
  subhead?: string | null;
  type?: string | null;
  urgency?: number | null;
  usageterms?: string | null;
  version_created?: string | null;
  wireq_receipt?: string | null;
}

export interface DebuggingMetaSchema {
  urn: string;
  creditline: string;
  headline: string;
  source_article_url: string;
}

export interface RoutingLayerSchema {
  top_k_publications: number;
  score_weight: number;
}

export interface RoutingLayerResultSchema {
  routing_score: number;
  routing_layer: RoutingLayerSchema;
}

export interface ScoredPublicationSchema {
  publication: PublicationSchema;
  routing_layer_results: RoutingLayerResultSchema[];
  final_score?: number | null;
}

export interface PublicationSchema {
  document_id: string;
  title: string;
  hostname: string;
  locale: string;
  all_locales?: string[] | null;
  is_sponsored?: boolean | null;
  set_quota?: number | null;
  distributed_amount?: number | null;
}

export interface RoutingMetaSchema {
  publications?: PublicationSchema[] | null;
  target_publication?: PublicationSchema | null;
  _router_name?: string | null;
  _scored_publications?: ScoredPublicationSchema | null;
}

export interface RewritingMetaSchema {
  enriched_data?: string | null;
}

export interface AsbMetaSchema {
  debugging_meta: DebuggingMetaSchema;
  routing_meta?: RoutingMetaSchema | null;
  rewriting_meta?: RewritingMetaSchema | null;
}

export interface DigitalwiresWrapperSchema {
  digitalwires: DigitalwiresSchema;
  asb_meta: AsbMetaSchema;
}

export interface DigitalwiresWrapperSchemaInternal {
  digitalwires: Omit<DigitalwiresSchema, 'entry_id'>;
  asb_meta: AsbMetaSchema;
}

export type RawAvroSchema = ReturnType<typeof readAVSC>;
