// scripts/prepare-quotes.js
const fs = require('fs');
const path = require('path');

const QUOTABLE_DATA_DIR = path.join(__dirname, '..', 'quotable-data-temp', 'data');
const OUTPUT_FILE = path.join(__dirname, '..', 'quotes.json');
const EMBED_FILE = path.join(__dirname, '..', 'quotes-data.js');

const TARGET_AUTHORS = {
  nietzsche: { name: '尼采', nameEn: 'Friedrich Nietzsche', quotableName: 'Friedrich Nietzsche', school: '存在主义', era: '1844-1900', originalLang: 'de', core: '权力意志、超人哲学、上帝已死、永恒轮回', style: '炽热、诗意、颠覆。用锤子进行哲学思考，重估一切价值。' },
  heidegger: { name: '海德格尔', nameEn: 'Martin Heidegger', quotableName: null, school: '存在主义', era: '1889-1976', originalLang: 'de', core: '此在(Dasein)、向死而生、存在与时间、技术在解蔽中遮蔽', style: '晦涩深刻。追问存在的意义，揭示日常沉沦中的本真可能。' },
  sartre: { name: '萨特', nameEn: 'Jean-Paul Sartre', quotableName: 'Jean-Paul Sartre', school: '存在主义', era: '1905-1980', originalLang: 'fr', core: '存在先于本质、他者即地狱、绝对自由、自欺', style: '锋利直接。人注定自由，也因此注定承担选择的全部重负。' },
  camus: { name: '加缪', nameEn: 'Albert Camus', quotableName: 'Albert Camus', school: '存在主义', era: '1913-1960', originalLang: 'fr', core: '荒谬、西西弗神话、反抗、局外人', style: '清醒而温柔。承认荒谬但不屈服，在无意义中创造意义。' },
  hegel: { name: '黑格尔', nameEn: 'G.W.F. Hegel', quotableName: null, school: '辩证/历史', era: '1770-1831', originalLang: 'de', core: '辩证法、主奴关系、绝对精神、理性的狡计', style: '宏大系统。矛盾不是终点而是动力，真理在整体中展开。' },
  marx: { name: '马克思', nameEn: 'Karl Marx', quotableName: null, school: '辩证/历史', era: '1818-1883', originalLang: 'de', core: '异化劳动、阶级斗争、历史唯物主义、资本批判', style: '批判性极强。揭露表象下的物质关系，哲学必须改变世界。' },
  engels: { name: '恩格斯', nameEn: 'Friedrich Engels', quotableName: null, school: '辩证/历史', era: '1820-1895', originalLang: 'de', core: '自然辩证法、历史合力论、劳动创造人', style: '清晰透彻。将辩证唯物主义贯穿自然与社会的统一解释。' },
  mao: { name: '毛泽东', nameEn: 'Mao Zedong', quotableName: 'Mao Zedong', school: '辩证/历史', era: '1893-1976', originalLang: 'zh', core: '矛盾论、实践论、群众路线、独立自主', style: '直白有力。用最简单的话说最深刻的道理，从实践中来到实践中去。' },
  aurelius: { name: '马可·奥勒留', nameEn: 'Marcus Aurelius', quotableName: 'Marcus Aurelius', school: '斯多葛', era: '121-180', originalLang: 'la', core: '内心自由、顺应自然、死亡冥想、理性支配', style: '内省沉稳。一个罗马皇帝写给自己的日记——如何在不完美的世界中保持内心的完整。' },
  seneca: { name: '塞涅卡', nameEn: 'Seneca the Younger', quotableName: 'Seneca the Younger', school: '斯多葛', era: '4 BC-65 AD', originalLang: 'la', core: '命运接受、时间意识、心灵平静、简朴生活', style: '睿智实用。哲学不是抽象思辨，而是生活的技艺。' },
  epictetus: { name: '爱比克泰德', nameEn: 'Epictetus', quotableName: 'Epictetus', school: '斯多葛', era: '55-135', originalLang: 'la', core: '控制的二分法、自由即理性、习惯的力量', style: '直指人心。一个曾经的奴隶教你什么才是真正的自由。' },
  confucius: { name: '孔子', nameEn: 'Confucius', quotableName: 'Confucius', school: '东方智慧', era: '551-479 BC', originalLang: 'zh', core: '仁、礼、中庸、君子之道、学而不厌', style: '温厚但绝不软弱。修身齐家治国平天下，起点永远是自身的修养。' },
  laozi: { name: '老子', nameEn: 'Laozi', quotableName: 'Laozi', school: '东方智慧', era: '6th century BC', originalLang: 'zh', core: '道法自然、无为而无不为、柔弱胜刚强、反者道之动', style: '玄妙而透辟。用最少的话推翻最多的执念，不争即是最大的争。' },
  suntzu: { name: '孙子', nameEn: 'Sun Tzu', quotableName: 'Sun Tzu', school: '东方智慧', era: '544-496 BC', originalLang: 'zh', core: '知己知彼、不战而屈人之兵、兵者诡道', style: '精确冷酷。竞争的本质不是勇猛而是计算和认知优势。' },
  plato: { name: '柏拉图', nameEn: 'Plato', quotableName: 'Plato', school: '理性主义', era: '428-348 BC', originalLang: 'grc', core: '理念论、洞穴比喻、哲人王、灵魂三分', style: '追问本质。我们看到的只是墙上的影子，真正的实在在洞穴之外。' },
  kant: { name: '康德', nameEn: 'Immanuel Kant', quotableName: 'Immanuel Kant', school: '理性主义', era: '1724-1804', originalLang: 'de', core: '道德律令、物自体、二律背反、启蒙即敢于运用理性', style: '严谨深刻。头顶的星空和心中的道德律——自由不在随心所欲，而在自我立法。' },
  schopenhauer: { name: '叔本华', nameEn: 'Arthur Schopenhauer', quotableName: 'Arthur Schopenhauer', school: '理性主义', era: '1788-1860', originalLang: 'de', core: '意志即痛苦、表象世界、艺术救赎、禁欲解脱', style: '悲观而诚实。生命即欲望的钟摆——在痛若与无聊之间来回摆动。' },
  buddha: { name: '佛陀', nameEn: 'The Buddha', quotableName: 'The Buddha', school: '超越视角', era: '5th century BC', originalLang: 'pi', core: '四圣谛、八正道、缘起性空、离苦得乐', style: '超然慈悲。痛苦源于执取——放下不是放弃，而是从根源上看见无我的实相。' },
  aristotle: { name: '亚里士多德', nameEn: 'Aristotle', quotableName: 'Aristotle', school: '古典智慧', era: '384-322 BC', originalLang: 'grc', core: '中庸之道、实践智慧(phronesis)、幸福(eudaimonia)、美德伦理', style: '理性而实用。幸福不是感觉，而是一种活动——灵魂合乎德性的实现。' },
  zhuangzi: { name: '庄子', nameEn: 'Zhuangzi', quotableName: null, school: '东方智慧', era: '369-286 BC', originalLang: 'zh', core: '逍遥游、齐物论、无用之用、庖丁解牛', style: '飘逸自由。以最浪漫的方式瓦解所有执念——与天地精神相往来。' },
  wangyangming: { name: '王阳明', nameEn: 'Wang Yangming', quotableName: null, school: '东方智慧', era: '1472-1529', originalLang: 'zh', core: '知行合一、致良知、心即理、事上磨练', style: '刚健笃实。知道的做不到，就是不知道。真理不在书上，在你心里。' },
  wittgenstein: { name: '维特根斯坦', nameEn: 'Ludwig Wittgenstein', quotableName: null, school: '语言/分析', era: '1889-1951', originalLang: 'de', core: '语言游戏、不可言说、生活形式、哲学即治疗', style: '极度诚实。对他能够说的就说清楚，对不能说的就必须保持沉默。' },
  descartes: { name: '笛卡尔', nameEn: 'René Descartes', quotableName: 'René Descartes', school: '理性主义', era: '1596-1650', originalLang: 'fr', core: '我思故我在、普遍怀疑、身心二元、方法论', style: '冷静精确。彻底的怀疑反而是找到确定性的唯一道路。' },
  spinoza: { name: '斯宾诺莎', nameEn: 'Baruch Spinoza', quotableName: null, school: '理性主义', era: '1632-1677', originalLang: 'la', core: '神即自然、情感几何学、自由即理解必然', style: '宁静如数学。不要哭，不要笑，要理解——用几何的冷静解剖情感。' },
  rousseau: { name: '卢梭', nameEn: 'Jean-Jacques Rousseau', quotableName: 'Jean-Jacques Rousseau', school: '启蒙/浪漫', era: '1712-1778', originalLang: 'fr', core: '社会契约、人生而自由却无往不在枷锁中、自然状态', style: '热情真挚。文明使人虚伪，回归自然才能找回真实的自己。' },
  foucault: { name: '福柯', nameEn: 'Michel Foucault', quotableName: null, school: '后现代/批判', era: '1926-1984', originalLang: 'fr', core: '权力/知识、规训社会、疯癫与文明、自我技术', style: '冷峻锐利。权力的可怕之处不在于它禁止，而在于它让我们以为自己是自由的。' },
  kierkegaard: { name: '克尔凯郭尔', nameEn: 'Søren Kierkegaard', quotableName: 'Søren Kierkegaard', school: '存在主义', era: '1813-1855', originalLang: 'da', core: '信仰之跃、焦虑即自由、人生三阶段、孤独个体', style: '炽热虔诚。焦虑不是病，是你面对无限可能性时的眩晕——那是自由的门槛。' }
};

// 手动语录：完全手动补充的 + 补充 Quotable 太少的
const MANUAL_QUOTES = {
  heidegger: [
    { content: '人是一种存在于世界之中的存在者，他不得不面对自己的存在——这便是烦（Sorge）。', original: 'Das Dasein ist ein Seiendes, das sich in seinem Sein zu diesem Sein verhält — und darin liegt die Sorge.', tags: ['存在', '本真'] },
    { content: '向死而生。唯有直面死亡，人才有可能从常人的沉沦中抽身，走向本真的自我。', original: 'Das Vorlaufen in den Tod ermöglichst allererst das eigentliche Selbstseinkönnen.', tags: ['死亡', '本真'] },
    { content: '语言是存在之家。人居住在语言的寓所中。', original: 'Die Sprache ist das Haus des Seins. In ihrer Behausung wohnt der Mensch.', tags: ['语言', '存在'] },
    { content: '焦虑揭示了此在在世界之中的无家可归状态。在焦虑中，我们感到万事万物的无意义。', original: 'Die Angst offenbart das Nichts. In der Angst ist einem unheimlich.', tags: ['焦虑', '存在'] },
    { content: '现代技术将一切存在者都变成了可供使用的持存物（Bestand）。', original: 'Das Wesen der Technik ist das Ge-stell. Der Mensch steht in der Gefahr, nur noch als Bestand genommen zu werden.', tags: ['技术', '异化'] },
    { content: '最可思虑的是我们——在需要思想时代——尚未思想。', original: 'Das Bedenklichste in unserer bedenklichen Zeit ist, dass wir noch nicht denken.', tags: ['思想', '时代'] },
    { content: '每个人都是他人，没有一个人是他自己。常人是此在的日常存在方式。', original: 'Jeder ist der Andere und Keiner er selbst.', tags: ['常人', '沉沦'] },
    { content: '唯有当我们真正地追问存在的意义时，我们才真正地成为人。', original: 'Die Frage nach dem Sinn des Seins ist die fundamentalste und konkreteste.', tags: ['存在', '意义'] },
    { content: '畏（Angst）不同于怕（Furcht）——怕总有具体的对象，而畏没有。畏让你面对的是世界本身。', original: 'Das Wovor der Angst ist das In-der-Welt-sein als solches.', tags: ['焦虑', '存在'] },
    { content: '诗人的天职是还乡——还乡就是返回到源泉的近旁。', original: 'Heimkunft ist Rückkehr in die Nähe zum Ursprung.', tags: ['诗', '家园'] }
  ],
  hegel: [
    { content: '凡是合乎理性的东西都是现实的；凡是现实的东西都是合乎理性的。', original: 'Was vernünftig ist, das ist wirklich; und was wirklich ist, das ist vernünftig.', tags: ['理性', '现实'] },
    { content: '真理是全体。真理只有作为体系才是现实的。', original: 'Das Wahre ist das Ganze.', tags: ['真理', '整体'] },
    { content: '密涅瓦的猫头鹰只有在黄昏时分才起飞。哲学对世界的反思总是来得太晚。', original: 'Die Eule der Minerva beginnt erst mit der einbrechenden Dämmerung ihren Flug.', tags: ['哲学', '反思'] },
    { content: '主人与奴隶的辩证法：奴隶在劳动中认识到自身的力量，而主人反而变得依赖奴隶。', original: 'Die Wahrheit des selbständigen Bewußtseins ist demnach das knechtische Bewußtsein.', tags: ['主奴', '劳动'] },
    { content: '自由是对必然的认识。只有认识了必然，意志才真正是自由的。', original: 'Freiheit ist die Einsicht in die Notwendigkeit.', tags: ['自由', '必然'] },
    { content: '凡是存在的，必在它的概念中消逝；凡是发展的，必包含它的否定在其中。', original: 'Die Knospe verschwindet in dem Hervorbrechen der Blüte.', tags: ['辩证', '否定'] },
    { content: '量的变化积累到一定程度，必然引起质的飞跃。', original: 'Das Umschlagen von Quantität in Qualität — ein Sprung aus quantitativer Veränderung in qualitative.', tags: ['量变质变', '辩证'] },
    { content: '人的欲望在于被另一个欲望所承认。人是为承认而斗争的存在。', original: 'Das Selbstbewußtsein ist an und für sich, indem und dadurch, dass es für ein anderes an und für sich ist.', tags: ['承认', '欲望'] },
    { content: '世界历史就是自由意识的进步史。', original: 'Die Weltgeschichte ist der Fortschritt im Bewußtsein der Freiheit.', tags: ['历史', '自由'] },
    { content: '凡是现实的都是合理的——但现实不等于现存。只有符合理性必然性的现存才是现实的。', original: 'Was wirklich ist, das ist vernünftig. Nicht alles, was existiert, ist wirklich.', tags: ['理性', '现实'] }
  ],
  marx: [
    { content: '哲学家们只是用不同的方式解释世界，而问题在于改变世界。', original: 'Die Philosophen haben die Welt nur verschieden interpretiert; es kömmt darauf an, sie zu verändern.', tags: ['实践', '改变'] },
    { content: '到目前为止的一切社会的历史都是阶级斗争的历史。', original: 'Die Geschichte aller bisherigen Gesellschaft ist die Geschichte von Klassenkämpfen.', tags: ['阶级', '历史'] },
    { content: '不是人们的意识决定人们的存在，相反，是人们的社会存在决定人们的意识。', original: 'Es ist nicht das Bewußtsein der Menschen, das ihr Sein, sondern umgekehrt ihr gesellschaftliches Sein, das ihr Bewußtsein bestimmt.', tags: ['存在', '意识'] },
    { content: '宗教是人民的鸦片。', original: 'Die Religion ist das Opium des Volkes.', tags: ['宗教', '异化'] },
    { content: '每个人的自由发展是一切人自由发展的条件。', original: 'Die freie Entwicklung eines Jeden ist die Bedingung für die freie Entwicklung Aller.', tags: ['自由', '社会'] },
    { content: '资本来到世间，从头到脚，每个毛孔都滴着血和肮脏的东西。', original: 'Das Kapital kommt zur Welt, von Kopf bis Zeh, aus allen Poren, blut- und schmutztriefend.', tags: ['资本', '批判'] },
    { content: '物质力量只能用物质力量来摧毁；但是理论一经掌握群众，也会变成物质力量。', original: 'Die Waffe der Kritik kann die Kritik der Waffen nicht ersetzen, aber die Theorie wird zur materiellen Gewalt, sobald sie die Massen ergreift.', tags: ['理论', '实践'] },
    { content: '人是社会关系的总和。人的本质不是单个人所固有的抽象物。', original: 'Das menschliche Wesen ist kein dem einzelnen Individuum innewohnendes Abstraktum. In seiner Wirklichkeit ist es das Ensemble der gesellschaftlichen Verhältnisse.', tags: ['人', '社会'] },
    { content: '一个幽灵，共产主义的幽灵，在欧洲游荡。', original: 'Ein Gespenst geht um in Europa — das Gespenst des Kommunismus.', tags: ['共产主义', '革命'] },
    { content: '在资本主义生产的条件下，工人生产的越多，他自己就越贫乏。', original: 'Der Arbeiter wird um so ärmer, je mehr Reichtum er produziert.', tags: ['异化', '劳动'] }
  ],
  zhuangzi: [
    { content: '天地与我并生，而万物与我为一。', original: '天地与我并生，而万物与我为一。', tags: ['齐物', '境界', '自然'] },
    { content: '子非鱼，安知鱼之乐？', original: '子非鱼，安知鱼之乐？', tags: ['认知', '局限'] },
    { content: '无用之用，方为大用。', original: '无用之用，方为大用。', tags: ['价值', '功利'] },
    { content: '至人无己，神人无功，圣人无名。', original: '至人无己，神人无功，圣人无名。', tags: ['自由', '自我'] },
    { content: '吾生也有涯，而知也无涯。以有涯随无涯，殆已。', original: '吾生也有涯，而知也无涯。以有涯随无涯，殆已。', tags: ['知识', '限度', '焦虑'] },
    { content: '相濡以沫，不如相忘于江湖。', original: '相濡以沫，不如相忘于江湖。', tags: ['关系', '自由', '爱情'] },
    { content: '举世誉之而不加劝，举世非之而不加沮。', original: '举世誉之而不加劝，举世非之而不加沮。', tags: ['独立', '外界评价'] },
    { content: '大知闲闲，小知间间。大言炎炎，小言詹詹。', original: '大知闲闲，小知间间。大言炎炎，小言詹詹。', tags: ['智慧', '焦虑'] },
    { content: '知其不可奈何而安之若命，德之至也。', original: '知其不可奈何而安之若命，德之至也。', tags: ['接受', '命运', '挫折'] },
    { content: '独与天地精神相往来。', original: '独与天地精神相往来。', tags: ['孤独', '自由', '精神'] },
    { content: '井蛙不可以语于海者，拘于虚也。', original: '井蛙不可以语于海者，拘于虚也。', tags: ['局限', '认知'] },
    { content: '人皆知有用之用，而莫知无用之用也。', original: '人皆知有用之用，而莫知无用之用也。', tags: ['价值', '功利', '内卷'] }
  ],
  wangyangming: [
    { content: '知行合一：知而不行，只是未知。', original: '知行合一：知而不行，只是未知。', tags: ['行动', '认知', '自律'] },
    { content: '破山中贼易，破心中贼难。', original: '破山中贼易，破心中贼难。', tags: ['自我', '成长'] },
    { content: '心即理也。天下又有心外之事、心外之理乎？', original: '心即理也。天下又有心外之事、心外之理乎？', tags: ['真理', '自我'] },
    { content: '此心不动，随机而动。', original: '此心不动，随机而动。', tags: ['冷静', '决策', '焦虑'] },
    { content: '人须在事上磨，方能立得住。', original: '人须在事上磨，方能立得住。', tags: ['实践', '成长', '挫折'] },
    { content: '志不立，天下无可成之事。', original: '志不立，天下无可成之事。', tags: ['志向', '成功', '迷茫'] },
    { content: '种树者必培其根，种德者必养其心。', original: '种树者必培其根，种德者必养其心。', tags: ['修养', '成长'] },
    { content: '良知是自家的准则。', original: '良知是自家的准则。', tags: ['道德', '判断'] },
    { content: '持志如心痛。一心在痛上，岂有工夫说闲话、管闲事？', original: '持志如心痛。一心在痛上，岂有工夫说闲话、管闲事？', tags: ['专注', '志向'] },
    { content: '悔悟是去病之药，然以改之为贵。', original: '悔悟是去病之药，然以改之为贵。', tags: ['后悔', '改变'] }
  ],
  wittgenstein: [
    { content: '对于不可言说的东西，我们必须保持沉默。', original: 'Wovon man nicht sprechen kann, darüber muss man schweigen.', tags: ['语言', '界限'] },
    { content: '语言的界限就是我的世界的界限。', original: 'Die Grenzen meiner Sprache bedeuten die Grenzen meiner Welt.', tags: ['认知', '局限'] },
    { content: '世界的意义必定在世界之外。', original: 'Der Sinn der Welt muss außerhalb ihrer liegen.', tags: ['意义', '超越'] },
    { content: '哲学是一场战斗——对抗语言对我们的理智的蛊惑。', original: 'Die Philosophie ist ein Kampf gegen die Verhexung unseres Verstandes durch die Mittel unserer Sprache.', tags: ['哲学', '语言'] },
    { content: '不要把任何东西当作理所当然——这是一种哲学态度。', original: 'Nimm nichts als selbstverständlich hin.', tags: ['思考', '习惯'] },
    { content: '如果一个问题可以提出来，它也可以被回答。', original: 'Wenn eine Frage sich stellen lässt, so kann sie auch beantwortet werden.', tags: ['问题', '解决'] },
    { content: '说清楚能说的，说不清楚的，就让它在那里——这就是诚实。', original: 'Man muss das, was sich sagen lässt, klar sagen.', tags: ['诚实', '认知'] },
    { content: '真正的生活不在时间里，而在当下。', original: 'Wenn man unter Ewigkeit nicht unendliche Zeitdauer, sondern Unzeitlichkeit versteht, dann lebt der ewig, der in der Gegenwart lebt.', tags: ['当下', '时间', '焦虑'] }
  ],
  spinoza: [
    { content: '不要哭，不要笑，要理解。', original: 'Non ridere, non lugere, neque detestari, sed intelligere.', tags: ['情感', '理性', '冷静'] },
    { content: '自由就是对必然性的认识。', original: 'Libertas est cognitionem necessitatis.', tags: ['自由', '认识'] },
    { content: '幸福不是德性的报酬，而是德性本身。', original: 'Beatitudo non est virtutis praemium, sed ipsa virtus.', tags: ['幸福', '道德'] },
    { content: '只要心灵按照理性的引导来理解事物，它就会同等地受到所有事物的影响——不管它是过去、现在还是未来。', original: 'Quatenus mens ex rationis dictamine res concipit, aeque afficitur, sive idea sit futurae vel praeteritae rei, sive praesentis.', tags: ['时间', '理性', '焦虑'] },
    { content: '上帝即自然——一切存在的东西都在上帝之中。', original: 'Deus sive Natura.', tags: ['自然', '整体'] },
    { content: '一种情感只有通过一种更强的情感才能被克服。', original: 'Affectus nec coerceri nec tolli potest, nisi per affectum contrarium et fortiorem.', tags: ['情感', '改变'] },
    { content: '心灵的最高善就是关于上帝的知识。', original: 'Mentis summum bonum est Dei cognitio.', tags: ['知识', '幸福'] },
    { content: '只要人是自然的一部分，人就受制于情感。', original: 'Homines eatenus perturbantur, quatenus sunt pars naturae.', tags: ['人性', '情感'] },
    { content: '和平不是没有战争，而是一种来自灵魂力量的德性。', original: 'Pax non est privatio belli, sed virtus quae ex animi fortitudine oritur.', tags: ['和平', '内心'] }
  ],
  foucault: [
    { content: '权力不是某个人或某群人所拥有的东西，而是弥散在整个社会中的关系网络。', original: 'Le pouvoir, ce n\'est pas une institution, et ce n\'est pas une structure, ce n\'est pas une certaine puissance dont certains seraient dotés.', tags: ['权力', '社会'] },
    { content: '知识就是权力，权力生产知识。', original: 'Pouvoir et savoir s\'impliquent directement l\'un l\'autre.', tags: ['知识', '权力'] },
    { content: '疯狂不是一种自然现象，而是文明建构的产物。', original: 'La folie n\'existe que dans une société.', tags: ['疯狂', '社会', '认知'] },
    { content: '我不关心我是谁——我关心的是我拒绝成为谁。', original: 'Je ne suis pas là pour dire qui je suis.', tags: ['自我', '自由'] },
    { content: '重要的不是过去，而是如何与过去决裂。', original: 'Ce qui est important, ce n\'est pas de regarder en arrière.', tags: ['过去', '改变'] },
    { content: '规训社会的终极目标不是惩罚你，而是使你成为你自己的看守。', original: 'Le surveillant, c\'est vous-même.', tags: ['规训', '自我', '内卷'] },
    { content: '哪里有权力的关系，哪里就有抵抗的可能。', original: 'Là où il y a pouvoir, il y a résistance.', tags: ['权力', '反抗', '行动'] },
    { content: '人终将被抹去，如同海边沙滩上的一张脸。', original: 'L\'homme s\'effacerait, comme à la limite de la mer un visage de sable.', tags: ['死亡', '意义'] }
  ],
  kierkegaard: [
    { content: '焦虑是自由的眩晕——当灵魂凝视可能性之深渊时产生的眩晕。', original: 'Angest er Frihedens Svimmelhed, der opstaar idet Aanden vil sætte Syntesen.', tags: ['焦虑', '自由', '选择'] },
    { content: '生命只能向后理解，但必须向前生活。', original: 'Livet skal forstås baglæns, men må leves forlæns.', tags: ['时间', '生活', '理解'] },
    { content: '敢于失去自己的立足之地，才是真正的信仰之跃。', original: 'At turde er at miste fodfæstet et øjeblik.', tags: ['勇气', '信念', '改变'] },
    { content: '人群就是谎言。', original: 'Mængden er Usandheden.', tags: ['孤独', '个体', '社会'] },
    { content: '最普遍的绝望是不愿成为自己。但最深层次的绝望是执意要成为他人。', original: 'Fortvivlelse er ikke at ville være sig selv.', tags: ['绝望', '自我', '比较'] },
    { content: '结婚你后悔，不结婚你也后悔——这就是人生的荒谬与幽默。', original: 'Gift dig, og du vil fortryde det; gift dig ikke, og du vil også fortryde det.', tags: ['选择', '后悔', '婚姻'] },
    { content: '焦虑是自由的学校——焦虑越深，人格越伟大。', original: 'Jo mere udpræget Angest, jo større Menneske.', tags: ['焦虑', '成长', '自由'] },
    { content: '信仰恰恰是对客观不确定性的拥抱。', original: 'Troen er netop den objektive Uvished.', tags: ['信念', '不确定', '勇气'] }
  ],
  aristotle: [
    { content: '幸福是灵魂合乎德性的实现活动。', original: 'Eudaimonia est animi actio quaedam secundum perfectam virtutem.', tags: ['幸福', '道德', '行动'] },
    { content: '我们反复做的事造就了我们。卓越不是一种行为，而是一种习惯。', original: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', tags: ['习惯', '卓越', '自律'] },
    { content: '认识你自己是所有智慧的开端。', original: 'Knowing yourself is the beginning of all wisdom.', tags: ['自我', '智慧'] },
    { content: '法律是免于激情的理性。', original: 'Law is reason free from passion.', tags: ['理性', '情感', '法律'] },
    { content: '朋友是住在两个身体里的同一个灵魂。', original: 'A friend is one soul inhabiting two bodies.', tags: ['友谊', '爱情'] },
    { content: '教育的根是苦的，但果实是甜的。', original: 'The roots of education are bitter, but the fruit is sweet.', tags: ['教育', '成长', '坚持'] },
    { content: '勇敢是中庸——在懦弱和鲁莽之间。', original: 'Courage is the mean between cowardice and rashness.', tags: ['勇气', '平衡'] },
    { content: '人是天生的政治动物。', original: 'Man is by nature a political animal.', tags: ['政治', '社会', '人性'] },
    { content: '智者追求的不是快乐，而是免于痛苦。', original: 'The wise man does not seek pleasure, but freedom from pain.', tags: ['智慧', '痛苦', '幸福'] },
    { content: '没有行动的思考是空洞的，没有思考的行动是盲目的。', original: 'Thought without action is empty; action without thought is blind.', tags: ['行动', '思考'] }
  ],
  descartes: [
    { content: '我思故我在。', original: 'Je pense, donc je suis.', tags: ['存在', '思考', '确定性'] },
    { content: '把每个困难分解为尽可能多的小部分来解决。', original: 'Diviser chacune des difficultés en autant de parcelles qu\'il se pourrait.', tags: ['方法', '解决', '焦虑'] },
    { content: '普遍的怀疑是找到确定性唯一道路。', original: 'Le doute est le commencement de la sagesse.', tags: ['怀疑', '真理', '思考'] },
    { content: '除了我们自己的思想，没有任何东西完全在我们的控制之中。', original: 'Il n\'y a rien qui soit entièrement en notre pouvoir que nos pensées.', tags: ['控制', '斯多葛', '焦虑'] },
    { content: '读一本好书，就是和许多高尚的人谈话。', original: 'La lecture de tous les bons livres est comme une conversation avec les plus honnêtes gens des siècles passés.', tags: ['阅读', '智慧'] },
    { content: '感官有时会欺骗我们，但理性不会。', original: 'Les sens nous trompent quelquefois.', tags: ['认知', '理性'] },
    { content: '征服自我比征服世界更难。', original: 'Il n\'est pas suffisant d\'avoir l\'esprit bon, le principal est de l\'appliquer bien.', tags: ['自我', '自律'] }
  ],
  rousseau: [
    { content: '人生而自由，却无往不在枷锁之中。', original: 'L\'homme est né libre, et partout il est dans les fers.', tags: ['自由', '社会', '文明'] },
    { content: '忍耐是痛苦的，但它的果实是甜的。', original: 'La patience est amère, mais son fruit est doux.', tags: ['忍耐', '成长', '坚持'] },
    { content: '自然是诚实的，社会是虚伪的。', original: 'La nature a fait l\'homme heureux et bon, mais la société le déprave et le rend misérable.', tags: ['自然', '社会', '真实'] },
    { content: '真正的幸福不是减少欲望，而是增加能力。', original: 'Le bonheur n\'est pas de diminuer ses désirs, mais d\'augmenter sa puissance.', tags: ['幸福', '欲望', '成长'] },
    { content: '我不比别人好，但我和别人不一样。', original: 'Si je ne vaux pas mieux, au moins je suis autre.', tags: ['自我', '独特', '比较'] },
    { content: '青春是学习智慧的季节，老年是实践智慧的季节。', original: 'La jeunesse est le temps d\'étudier la sagesse, la vieillesse est le temps de la pratiquer.', tags: ['时间', '智慧', '成长'] },
    { content: '人是善良的，是社会使他变坏。', original: 'L\'homme est naturellement bon, c\'est la société qui le corrompt.', tags: ['人性', '社会'] }
  ],
  engels: [
    { content: '劳动创造了人本身。', original: 'Die Arbeit hat den Menschen selbst geschaffen.', tags: ['劳动', '人类'] },
    { content: '自由不在于在幻想中摆脱自然规律而独立，而在于认识这些规律，从而有计划地使之为一定目的服务。', original: 'Freiheit besteht nicht in der geträumten Unabhängigkeit von den Naturgesetzen, sondern in der Erkenntnis dieser Gesetze.', tags: ['自由', '规律'] },
    { content: '一个民族要想站在科学的最高峰，就一刻也不能没有理论思维。', original: 'Ein Volk, das auf der Höhe der Wissenschaft stehen will, kann nicht ohne theoretisches Denken bestehen.', tags: ['思想', '科学'] },
    { content: '历史的最终结果总是从许多单个意志的相互冲突中产生出来的——这是历史的合力。', original: 'Das Endresultat geht aus den sich kreuzenden vielen Einzelwillen hervor.', tags: ['历史', '合力'] },
    { content: '辩证法不过是关于自然界、人类社会和思维的运动和发展的普遍规律的科学。', original: 'Die Dialektik ist die Wissenschaft von den allgemeinen Bewegungs- und Entwicklungsgesetzen der Natur, der Menschengesellschaft und des Denkens.', tags: ['辩证', '规律'] },
    { content: '没有哪一次巨大的历史灾难不是以历史的进步为补偿的。', original: 'Kein großes geschichtliches Unheil, das nicht durch einen geschichtlichen Fortschritt wettgemacht würde.', tags: ['历史', '进步'] },
    { content: '社会一旦有技术上的需要，则这种需要就会比十所大学更能把科学推向前进。', original: 'Hat die Gesellschaft ein technisches Bedürfnis, so hilft das der Wissenschaft mehr voran als zehn Universitäten.', tags: ['技术', '需求'] },
    { content: '没有一只猿手曾经制造过哪怕是最粗笨的石刀。劳动是从制造工具开始的。', original: 'Keine Affenhand hat je das plumpste Steinmesser verfertigt.', tags: ['劳动', '进化'] }
  ]
};

// 额外补充：Quotable 中数量太少的重要人物
const EXTRA_QUOTES = {
  mao: [
    { content: '谁是我们的敌人？谁是我们的朋友？这个问题是革命的首要问题。', original: '谁是我们的敌人？谁是我们的朋友？这个问题是革命的首要问题。', tags: ['策略', '分析'] },
    { content: '没有调查，就没有发言权。', original: '没有调查，就没有发言权。', tags: ['实践', '认识'] },
    { content: '枪杆子里面出政权。', original: '枪杆子里面出政权。', tags: ['权力', '革命'] },
    { content: '一切反动派都是纸老虎。', original: '一切反动派都是纸老虎。', tags: ['战略', '勇气'] },
    { content: '星星之火，可以燎原。', original: '星星之火，可以燎原。', tags: ['希望', '积累'] },
    { content: '实事求是。', original: '实事求是。', tags: ['方法', '认识'] },
    { content: '为人民服务。', original: '为人民服务。', tags: ['价值', '奉献'] },
    { content: '内因是变化的根据，外因是变化的条件。', original: '内因是变化的根据，外因是变化的条件。', tags: ['矛盾', '自主'] },
    { content: '斗争是绝对的，统一是相对的。', original: '斗争是绝对的，统一是相对的。', tags: ['矛盾', '辩证'] },
    { content: '自力更生，艰苦奋斗。', original: '自力更生，艰苦奋斗。', tags: ['独立', '毅力'] },
    { content: '世界上没有无缘无故的爱，也没有无缘无故的恨。', original: '世界上没有无缘无故的爱，也没有无缘无故的恨。', tags: ['因果', '阶级'] },
    { content: '战略上要藐视敌人，战术上要重视敌人。', original: '战略上要藐视敌人，战术上要重视敌人。', tags: ['战略', '勇气'] }
  ],
  kant: [
    { content: '有两种东西，我对它们的思考越是深沉和持久，它们在我心中唤起的惊奇和敬畏就越日新月异——头顶的星空和心中的道德律。', original: 'Der bestirnte Himmel über mir und das moralische Gesetz in mir.', tags: ['道德', '敬畏'] },
    { content: '要敢于运用你自己的理性！这就是启蒙的格言。', original: 'Sapere aude! Habe Mut, dich deines eigenen Verstandes zu bedienen!', tags: ['启蒙', '理性'] },
    { content: '你要这样行动：使你的意志的准则始终能够同时成为一条普遍的立法原则。', original: 'Handle nur nach derjenigen Maxime, durch die du zugleich wollen kannst, dass sie ein allgemeines Gesetz werde.', tags: ['道德', '义务'] },
    { content: '人是目的，而不仅仅是手段。', original: 'Handle so, dass du die Menschheit, sowohl in deiner Person als in der Person eines jeden anderen, jederzeit zugleich als Zweck, niemals bloß als Mittel brauchst.', tags: ['尊严', '伦理'] },
    { content: '没有内容的思想是空洞的，没有概念的直观是盲目的。', original: 'Gedanken ohne Inhalt sind leer, Anschauungen ohne Begriffe sind blind.', tags: ['认识', '理性'] },
    { content: '自由不是你想做什么就做什么，而是你不想做什么就能不做什么。', original: 'Freiheit ist nicht das Vermögen, ohne Gesetz zu handeln, sondern das Vermögen, nach der Vorstellung von Gesetzen zu handeln.', tags: ['自由', '自律'] },
    { content: '知识始于感觉，然后进入知性，最后终结于理性。', original: 'Alle unsere Erkenntnis hebt von den Sinnen an, geht von da zum Verstande und endigt bei der Vernunft.', tags: ['认识', '知识'] }
  ],
  schopenhauer: [
    { content: '生命是一团欲望，欲望不满足便痛苦，满足便无聊。人生就在痛苦和无聊之间摇摆。', original: 'Das Leben schwingt also, gleich einem Pendel, hin und her, zwischen dem Schmerz und der Langeweile.', tags: ['欲望', '痛苦'] },
    { content: '人可以做他想做的，但无法想要他想要的。', original: 'Der Mensch kann zwar tun, was er will, aber er kann nicht wollen, was er will.', tags: ['自由', '意志'] },
    { content: '要么孤独，要么庸俗。', original: 'Einsamkeit ist das Los aller hervorragenden Geister.', tags: ['孤独', '独立'] },
    { content: '财富就像海水：饮得越多，渴得越厉害。', original: 'Der Reichtum gleicht dem Seewasser: je mehr man davon trinkt, desto durstiger wird man.', tags: ['欲望', '财富'] },
    { content: '音乐是意志本身的直接摹本。', original: 'Die Musik ist die unmittelbare Abbildung des Willens selbst.', tags: ['艺术', '意志'] },
    { content: '一个人越是属于后世，他就越不为自己的时代所理解。', original: 'Je mehr einer der Nachwelt angehört, desto mehr ist er ein Fremdling seiner Zeit.', tags: ['孤独', '理解'] },
    { content: '每个人都将自己视野的界限当作世界的界限。', original: 'Jeder hält die Grenzen seines eigenen Gesichtskreises für die Grenzen der Welt.', tags: ['认识', '局限'] },
    { content: '我们感觉不到了的东西，对我们来说就等于没有。', original: 'Was man nicht fühlt, das ist für einen nicht.', tags: ['感受', '存在'] }
  ],
  suntzu: [
    { content: '知己知彼，百战不殆。', original: '知己知彼，百战不殆。', tags: ['策略', '认知'] },
    { content: '不战而屈人之兵，善之善者也。', original: '不战而屈人之兵，善之善者也。', tags: ['战略', '境界'] },
    { content: '上兵伐谋，其次伐交，其次伐兵，其下攻城。', original: '上兵伐谋，其次伐交，其次伐兵，其下攻城。', tags: ['策略', '层次'] },
    { content: '兵无常势，水无常形。能因敌变化而取胜者，谓之神。', original: '兵无常势，水无常形。', tags: ['变化', '灵活'] },
    { content: '胜兵先胜而后求战，败兵先战而后求胜。', original: '胜兵先胜而后求战，败兵先战而后求胜。', tags: ['准备', '胜利'] },
    { content: '知可以战与不可以战者胜。', original: '知可以战与不可以战者胜。', tags: ['判断', '时机'] },
    { content: '其疾如风，其徐如林，侵掠如火，不动如山。', original: '其疾如风，其徐如林，侵掠如火，不动如山。', tags: ['行动', '纪律'] }
  ],
  nietzsche_extra: [
    { content: '上帝已死。而我们杀死了他。我们——所有谋杀者中最伟大的谋杀者——将如何安慰自己？', original: 'Gott ist tot! Gott bleibt tot! Und wir haben ihn getötet!', tags: ['虚无', '价值'] },
    { content: '谁若与怪物搏斗，应当心自己在搏斗中不要变成怪物。当你长久凝视深渊，深渊也在凝视你。', original: 'Wer mit Ungeheuern kämpft, mag zusehn, dass er nicht dabei zum Ungeheuer wird. Und wenn du lange in einen Abgrund blickst, blickt der Abgrund auch in dich hinein.', tags: ['危险', '深渊'] },
    { content: '你必须有混沌在你的内心，才能诞生一颗跳舞的星。', original: 'Man muss noch Chaos in sich haben, um einen tanzenden Stern gebären zu können.', tags: ['创造', '混沌'] },
    { content: '人是一根绳索，架在动物和超人之间——一根悬在深渊上的绳索。', original: 'Der Mensch ist ein Seil, geknüpft zwischen Tier und Übermensch — ein Seil über einem Abgrunde.', tags: ['人', '超越'] },
    { content: '凡不能毁灭我的，必使我更强大。', original: 'Was mich nicht umbringt, macht mich stärker.', tags: ['坚韧', '成长'] },
    { content: '你要成为你自己。', original: 'Werde, der du bist.', tags: ['自我', '本真'] },
    { content: '没有音乐，生活将是一个错误。', original: 'Ohne Musik wäre das Leben ein Irrtum.', tags: ['艺术', '生活'] }
  ],
  sartre_extra: [
    { content: '人注定是自由的。人就是自由。', original: 'L\'homme est condamné à être libre.', tags: ['自由', '责任'] },
    { content: '他者即地狱——但这不意味着他人让我们受苦，而是他人的目光让我们无法成为自己。', original: 'L\'enfer, c\'est les autres.', tags: ['他人', '存在'] },
    { content: '存在先于本质——你先存在，然后才通过自己的选择定义自己。', original: 'L\'existence précède l\'essence.', tags: ['存在', '选择'] },
    { content: '人是自己选择的总和。', original: 'L\'homme est la somme de ses choix.', tags: ['选择', '自我'] },
    { content: '我们是我们所不是的，而不是我们所是的。', original: 'Nous sommes ce que nous ne sommes pas, et nous ne sommes pas ce que nous sommes.', tags: ['存在', '虚无'] }
  ],
  camus_extra: [
    { content: '真正严肃的哲学问题只有一个：自杀。判断生命是否值得活，就是回答哲学的根本问题。', original: 'Il n\'y a qu\'un problème philosophique vraiment sérieux : c\'est le suicide.', tags: ['生命', '荒谬'] },
    { content: '我们必须想象西西弗是幸福的。', original: 'Il faut imaginer Sisyphe heureux.', tags: ['荒谬', '幸福'] },
    { content: '在荒谬的体验中，痛苦是个体的。但是从反抗开始，痛苦就成了集体的。', original: 'Je me révolte, donc nous sommes.', tags: ['反抗', '团结'] },
    { content: '在冬天的正中心，我最终发现在我心里有一个不可战胜的夏天。', original: 'Au milieu de l\'hiver, j\'apprenais enfin qu\'il y avait en moi un été invincible.', tags: ['希望', '内心'] }
  ]
};

function main() {
  const rawQuotes = JSON.parse(fs.readFileSync(path.join(QUOTABLE_DATA_DIR, 'quotes.json'), 'utf-8'));
  const result = {};
  let total = 0;

  for (const [key, author] of Object.entries(TARGET_AUTHORS)) {
    let quotes = [];

    if (author.quotableName) {
      // 从 Quotable 提取（不限数量）
      const raw = rawQuotes
        .filter(q => q.author === author.quotableName)
        .map(q => ({ content: q.content, original: q.content, originalLang: 'en', tags: q.tags || [] }));
      quotes = [...raw];
    }

    // 添加完全手动的语录（海德格尔/黑格尔/马克思/恩格斯）
    if (MANUAL_QUOTES[key]) {
      const manual = MANUAL_QUOTES[key].map(q => ({ ...q, originalLang: author.originalLang }));
      quotes = [...quotes, ...manual];
    }

    // 添加额外补充语录
    if (EXTRA_QUOTES[key]) {
      const extra = EXTRA_QUOTES[key].map(q => ({ ...q, originalLang: author.originalLang }));
      quotes = [...quotes, ...extra];
    }

    // 尼采/萨特/加缪有单独的 extra key
    const extraKey = key + '_extra';
    if (EXTRA_QUOTES[extraKey]) {
      const extra = EXTRA_QUOTES[extraKey].map(q => ({ ...q, originalLang: author.originalLang }));
      quotes = [...quotes, ...extra];
    }

    // 去重（按 content 去重）
    const seen = new Set();
    quotes = quotes.filter(q => {
      const key2 = q.content.substring(0, 50);
      if (seen.has(key2)) return false;
      seen.add(key2);
      return true;
    });

    result[key] = { ...author, quotes };
    console.log(`${author.name}: ${quotes.length} quotes`);
    total += quotes.length;
  }

  // 清理构建时字段
  for (const key of Object.keys(result)) {
    delete result[key].quotableName;
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`\nTotal: ${total} quotes → quotes.json (${(JSON.stringify(result).length / 1024).toFixed(1)} KB)`);

  const minified = JSON.stringify(result);
  const embedScript = `/* 哲学家语录数据库 — ${new Date().toISOString().split('T')[0]} */\nconst PHILOSOPHERS = ${minified};\n`;
  fs.writeFileSync(EMBED_FILE, embedScript, 'utf-8');
  console.log(`quotes-data.js (${(minified.length / 1024).toFixed(1)} KB)`);
}

main();
