import {
  _seperateMetaAndTreeFromSentenceConll,
  _tabDictToJson,
  _metaConllLinesToJson,
  _tokenLineToJson,
  _extractTokenTabData,
  _treeConllLinesToJson,
  sentenceConllToJson,
  _tabJsonToDict,
  _tabDataJsonToConll,
  _tokenJsonToLine,
  _treeJsonToConll,
  _metaJsonToConll,
  _compareTokenIndexes,
  sentenceJsonToConll,
  MetaJson,
  TreeJson,
  SentenceJson,
  TokenJson,
  replaceArrayOfTokens,
} from './conll';

const featureConll = 'feat_key1=feat_value1|feat_key2=feat_value2';
const featureJson = { feat_key1: 'feat_value1', feat_key2: 'feat_value2' };

const tokenLine: string =
  '1\tform\tlemma\tupos\txpos\tfeat_key=feat_value\t2\tdeprel\tdep_key=dep_value\tmisc_key=misc_value';

const tokenJson: TokenJson = {
  ID: '1',
  FORM: 'form',
  LEMMA: 'lemma',
  UPOS: 'upos',
  XPOS: 'xpos',
  FEATS: { feat_key: 'feat_value' },
  HEAD: 2,
  DEPREL: 'deprel',
  DEPS: { dep_key: 'dep_value' },
  MISC: { misc_key: 'misc_value' },
  isGroup: false,
};

const metaJson: MetaJson = { meta_key: 'meta_value', meta_key2: 'meta_value2' };
const treeJson: TreeJson = { 1: tokenJson };
const sentenceJson: SentenceJson = { metaJson, treeJson };

const metaConll: string = '# meta_key = meta_value\n# meta_key2 = meta_value2';
const metaConllLines: string[] = metaConll.split('\n');
const treeConll: string = `${tokenLine}`;
const treeConllLines: string[] = treeConll.split('\n');
const sentenceConll: string = `${metaConll}\n${treeConll}`;
const untrimmedMetaConll: string = '# meta_key = meta_value\n       # meta_key2 = meta_value2';
const untrimmedMetaConllLines: string[] = metaConll.split('\n');
const untrimmedSentenceConll: string = `${untrimmedMetaConll}\n${treeConll}`;

// checks for hyphen instead of undescore
const hyphenInsteadOfUnderscoreLineConll: string = '1	form	lemma	upos	–	–	0	deprel	_	_';
const hyphenInsteadOfUnderscoreLineConllCorrected: string = '1	form	lemma	upos	_	_	0	deprel	_	_';
const hyphenInsteadOfUnderscoreLineJson: TokenJson = {
  ID: '1',
  FORM: 'form',
  LEMMA: 'lemma',
  UPOS: 'upos',
  XPOS: '_',
  FEATS: {},
  HEAD: 0,
  DEPREL: 'deprel',
  DEPS: {},
  MISC: {},
  isGroup: false,
};

// checks for "=" symbol is misc or feature field
const equalSymbolInMiscOrFeatureTokenLine: string = '1	form	lemma	upos	_	person=first=second	_	_	_	_';
// const hyphenInsteadOfUnderscoreLineConllCorrected: string = '1	form	lemma	upos	_	_	0	deprel	_	_';
const equalSymbolInMiscOrFeatureTokenJson: TokenJson = {
  ID: '1',
  FORM: 'form',
  LEMMA: 'lemma',
  UPOS: 'upos',
  XPOS: '_',
  FEATS: { person: 'first=second' },
  HEAD: -1,
  DEPREL: '_',
  DEPS: {},
  MISC: {},
  isGroup: false,
};

// check for group token, for exemple :
// 1-2  it's  _ _ _ _ _ _ _
// 1    it  it  _ _ _ _ _ _ _
// 2    's  's  _ _ _ _ _ _ _
const groupTokenLine: string = "1-2	it's	it's	upos	_	_	_	deprel	_	_";

const groupTokenJson: TokenJson = {
  ID: '1-2',
  FORM: "it's",
  LEMMA: "it's",
  UPOS: 'upos',
  XPOS: '_',
  FEATS: {},
  HEAD: -1,
  DEPREL: 'deprel',
  DEPS: {},
  MISC: {},
  isGroup: true,
};

test('_seperateMetaAndTreeFromSentenceConll', () => {
  expect(_seperateMetaAndTreeFromSentenceConll(sentenceConll)).toStrictEqual({
    metaLines: metaConllLines,
    treeLines: treeConllLines,
  });
  expect(_seperateMetaAndTreeFromSentenceConll(untrimmedSentenceConll)).toStrictEqual({
    metaLines: untrimmedMetaConllLines,
    treeLines: treeConllLines,
  });
});

test('_tabDictToJson', () => {
  expect(_tabDictToJson(featureConll)).toStrictEqual(featureJson);
  expect(_tabDictToJson('_')).toStrictEqual({});
});

test('_metaConllLinesToJson', () => {
  expect(_metaConllLinesToJson(metaConllLines)).toStrictEqual(metaJson);
});

test('_extractTokenTabData', () => {
  expect(_extractTokenTabData('3', 'int')).toBe(3);
  expect(_extractTokenTabData('3', 'str')).toBe('3');
  expect(() => {
    _extractTokenTabData('3', 'fake_type');
  }).toThrowError('fake_type is not a correct type');
});

test('_tokenLineToJson', () => {
  expect(_tokenLineToJson(tokenLine)).toStrictEqual(tokenJson);
  expect(_tokenLineToJson(hyphenInsteadOfUnderscoreLineConll)).toStrictEqual(hyphenInsteadOfUnderscoreLineJson);
  expect(_tokenLineToJson(equalSymbolInMiscOrFeatureTokenLine)).toStrictEqual(equalSymbolInMiscOrFeatureTokenJson);
  expect(_tokenLineToJson(groupTokenLine)).toStrictEqual(groupTokenJson);
});

test('_treeConllLinesToJson', () => {
  expect(_treeConllLinesToJson(treeConllLines)).toStrictEqual(treeJson);
});

test('sentenceConllToJson', () => {
  expect(sentenceConllToJson(sentenceConll)).toStrictEqual(sentenceJson);
});

test('_tabJsonToDict', () => {
  expect(_tabJsonToDict(featureJson)).toBe(featureConll);
  expect(_tabJsonToDict({})).toBe('_');
});

test('_tabDataJsonToConll', () => {
  expect(_tabDataJsonToConll(3, 'int')).toBe('3');
  expect(_tabDataJsonToConll('3', 'str')).toBe('3');
  expect(() => {
    _tabDataJsonToConll('3', 'fake_type');
  }).toThrowError('fake_type is not a correct type');
});

test('_tokenJsonToLine', () => {
  expect(_tokenJsonToLine(tokenJson)).toStrictEqual(tokenLine);
  expect(_tokenJsonToLine(hyphenInsteadOfUnderscoreLineJson)).toStrictEqual(
    hyphenInsteadOfUnderscoreLineConllCorrected,
  );
});

test('_treeJsonToConll', () => {
  expect(_treeJsonToConll(treeJson)).toStrictEqual(treeConll);
});

test('_metaJsonToConll', () => {
  expect(_metaJsonToConll(metaJson)).toStrictEqual(metaConll);
});

test('sentenceJsonToConll', () => {
  expect(sentenceJsonToConll(sentenceJson)).toStrictEqual(sentenceConll);
});

test('_compareTokenIndexes', () => {
  expect(_compareTokenIndexes('1', '2')).toStrictEqual(-1);
  expect(_compareTokenIndexes('1', '3')).toStrictEqual(-2);
  expect(_compareTokenIndexes('10', '5')).toStrictEqual(5);
  expect(_compareTokenIndexes('10-11', '10')).toStrictEqual(-3);
});

const treeJsonToBeReplaceArray: TreeJson = {
  '1-2': {
    ID: '1-2',
    FORM: 'I eat',
    LEMMA: '_',
    UPOS: '_',
    XPOS: '_',
    FEATS: {},
    HEAD: -1,
    DEPREL: '_',
    DEPS: {},
    MISC: {},
    isGroup: true,
  },
  '1': {
    ID: '1',
    FORM: 'I',
    LEMMA: '_',
    UPOS: '_',
    XPOS: '_',
    FEATS: {},
    HEAD: 4,
    DEPREL: '_',
    DEPS: {},
    MISC: {},
    isGroup: false,
  },
  '2': {
    ID: '2',
    FORM: 'eat',
    LEMMA: '_',
    UPOS: '_',
    XPOS: '_',
    FEATS: {},
    HEAD: 0,
    DEPREL: '_',
    DEPS: {},
    MISC: {},
    isGroup: false,
  },
  '2-4': {
    ID: '2-4',
    FORM: 'eat an apple',
    LEMMA: '_',
    UPOS: '_',
    XPOS: '_',
    FEATS: {},
    HEAD: -1,
    DEPREL: '_',
    DEPS: {},
    MISC: {},
    isGroup: true,
  },
  '3': {
    ID: '3',
    FORM: 'an',
    LEMMA: 'lemma',
    UPOS: 'upos',
    XPOS: '_',
    FEATS: {},
    HEAD: 4,
    DEPREL: '_',
    DEPS: {},
    MISC: {},
    isGroup: false,
  },
  '3-4': {
    ID: '3-4',
    FORM: 'an apple',
    LEMMA: '_',
    UPOS: '_',
    XPOS: '_',
    FEATS: {},
    HEAD: -1,
    DEPREL: '_',
    DEPS: {},
    MISC: {},
    isGroup: true,
  },
  '4': {
    ID: '4',
    FORM: 'apple',
    LEMMA: '_',
    UPOS: '_',
    XPOS: '_',
    FEATS: {},
    HEAD: 2,
    DEPREL: '_',
    DEPS: {},
    MISC: {},
    isGroup: false,
  },
};

const treeJsonReplacedArray: TreeJson = {
  '1-2': {
    ID: '1-2',
    FORM: 'I eat',
    LEMMA: '_',
    UPOS: '_',
    XPOS: '_',
    FEATS: {},
    HEAD: -1,
    DEPREL: '_',
    DEPS: {},
    MISC: {},
    isGroup: true,
  },
  '1': {
    ID: '1',
    FORM: 'I',
    LEMMA: '_',
    UPOS: '_',
    XPOS: '_',
    FEATS: {},
    HEAD: 5,
    DEPREL: '_',
    DEPS: {},
    MISC: {},
    isGroup: false,
  },
  '2': {
    ID: '2',
    FORM: 'eat',
    LEMMA: '_',
    UPOS: '_',
    XPOS: '_',
    FEATS: {},
    HEAD: 0,
    DEPREL: '_',
    DEPS: {},
    MISC: {},
    isGroup: false,
  },
  '2-5': {
    ID: '2-5',
    FORM: 'eat an apple',
    LEMMA: '_',
    UPOS: '_',
    XPOS: '_',
    FEATS: {},
    HEAD: -1,
    DEPREL: '_',
    DEPS: {},
    MISC: {},
    isGroup: true,
  },
  '3-4': {
    ID: '3-4',
    FORM: 'an apple',
    LEMMA: '_',
    UPOS: '_',
    XPOS: '_',
    FEATS: {},
    HEAD: -1,
    DEPREL: '_',
    DEPS: {},
    MISC: {},
    isGroup: true,
  },
  '3': {
    ID: '3',
    FORM: 'a',
    LEMMA: '_',
    UPOS: '_',
    XPOS: '_',
    FEATS: {},
    HEAD: -1,
    DEPREL: '_',
    DEPS: {},
    MISC: {},
    isGroup: false,
  },
  '4': {
    ID: '4',
    FORM: 'red',
    LEMMA: '_',
    UPOS: '_',
    XPOS: '_',
    FEATS: {},
    HEAD: -1,
    DEPREL: '_',
    DEPS: {},
    MISC: {},
    isGroup: false,
  },
  '5': {
    ID: '5',
    FORM: 'apple',
    LEMMA: '_',
    UPOS: '_',
    XPOS: '_',
    FEATS: {},
    HEAD: 2,
    DEPREL: '_',
    DEPS: {},
    MISC: {},
    isGroup: false,
  },
};

test('replaceArrayOfTokens', () => {
  expect(replaceArrayOfTokens(treeJsonToBeReplaceArray, [3], ['a', 'red'])).toStrictEqual(treeJsonReplacedArray);
});
