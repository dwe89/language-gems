-- VERBS (71 missing) - Part 1: Essential Tenses
INSERT INTO grammar_topics (
  id, topic_name, slug, language, category, difficulty_level, curriculum_level,
  title, description, learning_objectives, order_position, is_active, prerequisite_topics
) VALUES 
-- Essential Tenses
(gen_random_uuid(), 'present_tense', 'present-tense', 'es', 'verbs', 'beginner', 'KS3',
 'Present Tense', 'Learn Spanish present tense',
 ARRAY['Conjugate regular verbs in present tense', 'Use present tense in context', 'Identify present tense forms', 'Apply present tense rules'],
 1, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'present_continuous', 'present-continuous', 'es', 'verbs', 'intermediate', 'KS3',
 'Present Continuous', 'Learn Spanish present continuous',
 ARRAY['Form present continuous tense', 'Use present continuous appropriately', 'Distinguish from simple present', 'Apply continuous aspect rules'],
 2, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'present_perfect', 'present-perfect', 'es', 'verbs', 'intermediate', 'KS3',
 'Present Perfect', 'Learn Spanish present perfect',
 ARRAY['Form present perfect tense', 'Use present perfect appropriately', 'Understand perfect aspect', 'Apply present perfect rules'],
 3, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'preterite', 'preterite', 'es', 'verbs', 'intermediate', 'KS3',
 'Preterite', 'Learn Spanish preterite',
 ARRAY['Conjugate verbs in preterite', 'Use preterite for completed actions', 'Distinguish from imperfect', 'Apply preterite rules'],
 4, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'imperfect', 'imperfect', 'es', 'verbs', 'intermediate', 'KS3',
 'Imperfect', 'Learn Spanish imperfect',
 ARRAY['Conjugate verbs in imperfect', 'Use imperfect for ongoing actions', 'Distinguish from preterite', 'Apply imperfect rules'],
 5, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'imperfect_continuous', 'imperfect-continuous', 'es', 'verbs', 'intermediate', 'KS3',
 'Imperfect Continuous', 'Learn Spanish imperfect continuous',
 ARRAY['Form imperfect continuous', 'Use imperfect continuous appropriately', 'Understand past continuous aspect', 'Apply imperfect continuous rules'],
 6, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'future', 'future', 'es', 'verbs', 'intermediate', 'KS3',
 'Future', 'Learn Spanish future',
 ARRAY['Conjugate verbs in future tense', 'Use future tense appropriately', 'Express future plans and predictions', 'Apply future tense rules'],
 7, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'future_perfect', 'future-perfect', 'es', 'verbs', 'advanced', 'KS3',
 'Future Perfect', 'Learn Spanish future perfect',
 ARRAY['Form future perfect tense', 'Use future perfect appropriately', 'Express completed future actions', 'Apply future perfect rules'],
 8, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'future_tense', 'future-tense', 'es', 'verbs', 'intermediate', 'KS3',
 'Future Tense', 'Learn Spanish future tense',
 ARRAY['Understand future tense concept', 'Apply future tense rules correctly', 'Identify future tense in context', 'Use future tense in sentences'],
 9, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'periphrastic_future', 'periphrastic-future', 'es', 'verbs', 'intermediate', 'KS3',
 'Periphrastic Future', 'Learn Spanish periphrastic future',
 ARRAY['Form periphrastic future (ir a + infinitive)', 'Use periphrastic future appropriately', 'Distinguish from simple future', 'Apply periphrastic future rules'],
 10, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'conditional', 'conditional', 'es', 'verbs', 'intermediate', 'KS3',
 'Conditional', 'Learn Spanish conditional',
 ARRAY['Conjugate verbs in conditional', 'Use conditional for hypothetical situations', 'Express politeness with conditional', 'Apply conditional rules'],
 11, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'conditional_perfect', 'conditional-perfect', 'es', 'verbs', 'advanced', 'KS3',
 'Conditional Perfect', 'Learn Spanish conditional perfect',
 ARRAY['Form conditional perfect tense', 'Use conditional perfect appropriately', 'Express hypothetical past actions', 'Apply conditional perfect rules'],
 12, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'conditional_tense', 'conditional-tense', 'es', 'verbs', 'intermediate', 'KS3',
 'Conditional Tense', 'Learn Spanish conditional tense',
 ARRAY['Understand conditional tense concept', 'Apply conditional tense rules correctly', 'Identify conditional tense in context', 'Use conditional tense in sentences'],
 13, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'pluperfect', 'pluperfect', 'es', 'verbs', 'advanced', 'KS3',
 'Pluperfect', 'Learn Spanish pluperfect',
 ARRAY['Form pluperfect tense', 'Use pluperfect for past perfect actions', 'Understand pluperfect timing', 'Apply pluperfect rules'],
 14, true, ARRAY[]::uuid[]),

-- Subjunctive & Moods
(gen_random_uuid(), 'subjunctive', 'subjunctive', 'es', 'verbs', 'advanced', 'KS3',
 'Subjunctive', 'Learn Spanish subjunctive',
 ARRAY['Understand subjunctive mood concept', 'Form subjunctive correctly', 'Use subjunctive in appropriate contexts', 'Apply subjunctive rules'],
 15, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'subjunctive_present', 'subjunctive-present', 'es', 'verbs', 'advanced', 'KS3',
 'Subjunctive Present', 'Learn Spanish subjunctive present',
 ARRAY['Form present subjunctive', 'Use present subjunctive appropriately', 'Recognize subjunctive triggers', 'Apply present subjunctive rules'],
 16, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'subjunctive_imperfect', 'subjunctive-imperfect', 'es', 'verbs', 'advanced', 'KS3',
 'Subjunctive Imperfect', 'Learn Spanish subjunctive imperfect',
 ARRAY['Form imperfect subjunctive', 'Use imperfect subjunctive appropriately', 'Understand subjunctive sequence of tenses', 'Apply imperfect subjunctive rules'],
 17, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'subjunctive_perfect', 'subjunctive-perfect', 'es', 'verbs', 'advanced', 'KS3',
 'Subjunctive Perfect', 'Learn Spanish subjunctive perfect',
 ARRAY['Form perfect subjunctive', 'Use perfect subjunctive appropriately', 'Understand perfect subjunctive timing', 'Apply perfect subjunctive rules'],
 18, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'subjunctive_pluperfect', 'subjunctive-pluperfect', 'es', 'verbs', 'advanced', 'KS3',
 'Subjunctive Pluperfect', 'Learn Spanish subjunctive pluperfect',
 ARRAY['Form pluperfect subjunctive', 'Use pluperfect subjunctive appropriately', 'Understand pluperfect subjunctive timing', 'Apply pluperfect subjunctive rules'],
 19, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'imperative', 'imperative', 'es', 'verbs', 'intermediate', 'KS3',
 'Imperative', 'Learn Spanish imperative',
 ARRAY['Form imperative mood', 'Use imperative for commands', 'Distinguish formal/informal imperatives', 'Apply imperative rules'],
 20, true, ARRAY[]::uuid[]),

-- Verb Types & Patterns
(gen_random_uuid(), 'irregular_verbs', 'irregular-verbs', 'es', 'verbs', 'intermediate', 'KS3',
 'Irregular Verbs', 'Learn Spanish irregular verbs',
 ARRAY['Identify irregular verb patterns', 'Conjugate common irregular verbs', 'Memorize irregular verb forms', 'Apply irregular verb rules'],
 21, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'stem_changing', 'stem-changing', 'es', 'verbs', 'intermediate', 'KS3',
 'Stem Changing', 'Learn Spanish stem changing',
 ARRAY['Identify stem-changing patterns', 'Apply stem changes correctly', 'Recognize stem-changing verbs', 'Use stem-changing verbs in context'],
 22, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'modal_verbs', 'modal-verbs', 'es', 'verbs', 'intermediate', 'KS3',
 'Modal Verbs', 'Learn Spanish modal verbs',
 ARRAY['Understand modal verb concept', 'Use modal verbs correctly', 'Express ability, permission, obligation', 'Apply modal verb rules'],
 23, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'reflexive', 'reflexive', 'es', 'verbs', 'intermediate', 'KS3',
 'Reflexive', 'Learn Spanish reflexive',
 ARRAY['Understand reflexive verb concept', 'Use reflexive pronouns correctly', 'Identify reflexive verbs', 'Apply reflexive verb rules'],
 24, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'ser_vs_estar', 'ser-vs-estar', 'es', 'verbs', 'intermediate', 'KS3',
 'Ser Vs Estar', 'Learn Spanish ser vs estar',
 ARRAY['Distinguish between ser and estar', 'Use ser for permanent states', 'Use estar for temporary states', 'Apply ser vs estar rules'],
 25, true, ARRAY[]::uuid[]);
