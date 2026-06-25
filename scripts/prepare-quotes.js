// scripts/prepare-quotes.js
const fs = require('fs');
const path = require('path');

const QUOTABLE_DATA_DIR = path.join(__dirname, '..', 'quotable-data-temp', 'data');
const OUTPUT_FILE = path.join(__dirname, '..', 'quotes.json');
const EMBED_FILE = path.join(__dirname, '..', 'quotes-data.js');

// Rich philosopher profiles with detailed theories, works, and analytical methods
const TARGET_AUTHORS = {
  nietzsche: { name:'尼采', nameEn:'Friedrich Nietzsche', quotableName:'Friedrich Nietzsche', school:'存在主义', era:'1844-1900', originalLang:'de',
    core:'权力意志、超人哲学、上帝已死、永恒轮回、主人道德与奴隶道德、视角主义',
    style:'用格言和诗意的警句进行哲学爆破。不建立体系，而是用锤子敲击一切既有的价值——看它们是否空洞。热爱命运(amor fati)——肯定生命的一切，包括苦难。',
    works:'《查拉图斯特拉如是说》《善恶的彼岸》《道德的谱系》《权力意志》',
    method:'他分析任何问题都会追问："这背后的权力意志是什么？谁在定义善恶？这种价值是强者的自我肯定，还是弱者的怨恨转嫁？" 他会用谱系学方法追溯观念的起源，揭露其背后被掩盖的权力关系。'},

  heidegger: { name:'海德格尔', nameEn:'Martin Heidegger', quotableName:null, school:'存在主义', era:'1889-1976', originalLang:'de',
    core:'此在(Dasein)、在世之在、向死而生、常人(das Man)、烦(Sorge)、时间性、技术的座架(Ge-stell)',
    style:'制造新词来打破日常思维的惯性。用晦涩而精确的语言逼读者直面被遗忘的存在问题。',
    works:'《存在与时间》《林中路》《技术的追问》《形而上学导论》',
    method:'他会追问："你此刻的存在方式是什么？你是否沉沦在常人的平均状态中——做着所有人都在做的事、说着所有人都在说的话？焦虑不是你出了问题，而是你瞥见了本真存在的可能。" 他用现象学方法悬置常识，直接描述被遮蔽的存在经验。'},

  sartre: { name:'萨特', nameEn:'Jean-Paul Sartre', quotableName:'Jean-Paul Sartre', school:'存在主义', era:'1905-1980', originalLang:'fr',
    core:'存在先于本质、绝对自由与绝对责任、自欺(mauvaise foi)、他者的目光、虚无化',
    style:'直接、不绕弯。用小说、戏剧和哲学论文同一种力度传达存在主义的困境——人是被抛入自由的，无法逃避选择。',
    works:'《存在与虚无》《存在主义是一种人道主义》《恶心》《禁闭》',
    method:'他会追问："你此刻的选择正在定义你是什么样的人——但你有没有假装自己别无选择？你在用什么样的自欺逃避自由带来的焦虑？他者的目光如何把你变成了客体？" 他的分析始终围绕自由-责任-自欺的三角展开。'},

  camus: { name:'加缪', nameEn:'Albert Camus', quotableName:'Albert Camus', school:'存在主义', era:'1913-1960', originalLang:'fr',
    core:'荒谬(absurde)、反抗(révolte)、西西弗、局外人、南方思想',
    style:'清醒、克制，有地中海的阳光质感。不喊口号，用文学形象和简洁论述传达"世界没有终极意义，但值得全力去活"。',
    works:'《西西弗神话》《局外人》《鼠疫》《反抗者》',
    method:'他会追问："你面对的荒谬是什么——是你对意义的渴望与世界沉默之间的裂缝？既然没有终极答案，你选择自杀、信仰之跃、还是像西西弗那样推石头上山并从中找到幸福？" 他的分析总是从荒谬出发，走向反抗——不是造反，而是清醒地继续活着。'},

  hegel: { name:'黑格尔', nameEn:'G.W.F. Hegel', quotableName:null, school:'辩证/历史', era:'1770-1831', originalLang:'de',
    core:'辩证法（正-反-合）、主奴辩证法、承认斗争、理性的狡计、绝对精神、异化与扬弃',
    style:'宏大系统式思维。一切矛盾都不是终点，而是通往更高综合的动力。历史不是偶然事件的堆积，而是自由意识逐步实现的过程。',
    works:'《精神现象学》《逻辑学》《法哲学原理》',
    method:'他会追问："你看到的这个对立面（A vs B），其实不是终极的对立——有没有一个更高的视角可以看到A和B都是更大整体的一个环节？你现在的痛苦是否恰恰是推动你走向更高认识的动力？" 他的分析永远在寻找矛盾背后的综合可能。'},

  marx: { name:'马克思', nameEn:'Karl Marx', quotableName:null, school:'辩证/历史', era:'1818-1883', originalLang:'de',
    core:'历史唯物主义、异化劳动(四种异化)、剩余价值、阶级斗争、经济基础与上层建筑、商品拜物教',
    style:'冷峻的批判，用经济关系的解剖刀切开一切意识形态的外衣。从不谈抽象的人性——人的本质是社会关系的总和。',
    works:'《资本论》《1844年经济学哲学手稿》《共产党宣言》《德意志意识形态》',
    method:'他会追问："这个问题的物质基础是什么？谁掌握生产资料？这种意识形态服务于哪个阶级的利益？你把社会关系误认为自然规律了吗？" 他的分析总是从生产关系出发，追问上层建筑（法律、道德、宗教、哲学）如何为经济基础服务。'},

  engels: { name:'恩格斯', nameEn:'Friedrich Engels', quotableName:null, school:'辩证/历史', era:'1820-1895', originalLang:'de',
    core:'历史合力论、自然辩证法、劳动创造人、家庭私有制与国家起源、量变质变',
    style:'比马克思更通俗、更具解释力。善于用自然科学和历史实例来阐述辩证唯物主义的原理。',
    works:'《反杜林论》《自然辩证法》《家庭、私有制和国家的起源》《路德维希·费尔巴哈和德国古典哲学的终结》',
    method:'他会追问："你看到的这个现象，是无数个体意志冲突产生的合力——不是任何单个人的意图，而是整体运动的客观结果。它的物质根源在哪里？生产力的变化如何推动了社会关系的重组？" 他特别善于分析两性关系、家庭形式如何随生产方式演变。'},

  mao: { name:'毛泽东', nameEn:'Mao Zedong', quotableName:'Mao Zedong', school:'辩证/历史', era:'1893-1976', originalLang:'zh',
    core:'矛盾论（主要矛盾与次要矛盾、矛盾的主要方面与次要方面）、实践论、群众路线、实事求是、独立自主',
    style:'用最朴素的中文讲最深刻的辩证法。拒绝空谈，一切从实践出发——"你要知道梨子的滋味，你就得变革梨子，亲口吃一吃"。',
    works:'《矛盾论》《实践论》《论持久战》《中国革命战争的战略问题》',
    method:'他会追问："这件事的主要矛盾是什么？矛盾的主要方面在哪一边？矛盾双方在什么条件下可以转化？你的认识是从实践中来的还是在书斋里空想的？" 他的分析方法永远是抓主要矛盾、看转化条件、从实践中检验。'},

  aurelius: { name:'马可·奥勒留', nameEn:'Marcus Aurelius', quotableName:'Marcus Aurelius', school:'斯多葛', era:'121-180', originalLang:'la',
    core:'控制的二分法（区分可控与不可控）、顺应自然/理性(logos)、死亡冥想(memento mori)、俯瞰视角、内在堡垒',
    style:'一个罗马皇帝在战场的帐篷里写给自己的日记——不教导他人，只提醒自己。自省、克制、有威严但不傲慢。',
    works:'《沉思录》',
    method:'他会追问："这件事在你的控制之中吗？如果不在——比如他人的看法、过去的选择、身体的衰老——那你就没有理由为它苦恼。如果在——比如你的判断、你的回应、你的品格——那就去做。每天早上提醒自己：今天我会遇到傲慢的人、忘恩负义的人——但他们和我一样是理性动物，我没有理由被他们伤害。"'},

  seneca: { name:'塞涅卡', nameEn:'Seneca the Younger', quotableName:'Seneca the Younger', school:'斯多葛', era:'4 BC-65 AD', originalLang:'la',
    core:'时间是最珍贵的资源、愤怒是短暂的疯狂、命运接受(amor fati)、简朴训练、哲学即生活技艺',
    style:'睿智、实用、有修辞美感。不是抽象论述，而是直接给朋友写信教他怎么活。',
    works:'《论生命的短暂》《论愤怒》《论幸福生活》《道德书简》',
    method:'他会追问："你以为你的时间很多？算一算你真正为自己而活的日子有多少——大部分时间被无关的人、无谓的社交、无用的焦虑消耗了。你现在愤怒的事情，一年后还重要吗？与其被命运拖着走，不如主动接受它。"'},

  epictetus: { name:'爱比克泰德', nameEn:'Epictetus', quotableName:'Epictetus', school:'斯多葛', era:'55-135', originalLang:'la',
    core:'控制的二分法（核心教义）、impressions与判断、自由即意志的自主、习惯即命运',
    style:'直率到近乎粗暴。一个曾经的奴隶告诉你——真正的枷锁不是铁链，而是你对外界事物的错误判断。',
    works:'《手册》《谈话录》',
    method:'他会追问："你烦恼的不是事情本身，而是你对事情的判断。有人侮辱你？侮辱你的不是那个人——是你自己同意了他的侮辱。把一切区分为「取决于我的」和「不取决于我的」——只在乎前者，毫不在意后者。这就是自由的秘诀。"'},

  confucius: { name:'孔子', nameEn:'Confucius', quotableName:'Confucius', school:'东方智慧', era:'551-479 BC', originalLang:'zh',
    core:'仁（爱人、克己复礼为仁）、礼（社会规范与秩序）、君子之道、中庸、正名、学思结合',
    style:'温良恭俭让，但原则问题上绝不退让。不空谈玄理，每一句话都有具体的实践指向——从修身开始，一层层外推到齐家治国平天下。',
    works:'《论语》（弟子编纂）、《春秋》（编修）',
    method:'他会追问："你先看看自己做得如何——己所不欲勿施于人，你做到了吗？这件事上谁是君子谁是小人——不是按地位，是按行为。近处的秩序都没建立好，却去操心远方的大事？修身是本，其余是末。"'},

  laozi: { name:'老子', nameEn:'Laozi', quotableName:'Laozi', school:'东方智慧', era:'6th century BC', originalLang:'zh',
    core:'道（不可道、不可名、自然无为）、反者道之动（物极必反）、柔弱胜刚强、无为而无不为、知足不辱',
    style:'极端简洁，每句话都可以展开成一本书。不争辩、不给长篇论证——直接给出反转日常直觉的洞见。',
    works:'《道德经》',
    method:'他会追问："你越是用力抓住什么，它越会从你手中滑走。你拼命追求的东西——成功、认可、控制——恰恰因为你在追求而变得遥不可及。柔弱不是软弱，水没有固定的形状，但它可以穿透石头。不争，故天下莫能与之争。"'},

  suntzu: { name:'孙子', nameEn:'Sun Tzu', quotableName:'Sun Tzu', school:'东方智慧', era:'544-496 BC', originalLang:'zh',
    core:'知己知彼、不战而屈人之兵（最高境界）、道天地将法（五事）、奇正相生、兵无常势',
    style:'极度精确，每一个字都有战略含义。不鼓励勇气，只讲计算——真正的胜利在开战前就已经决定了。',
    works:'《孙子兵法》',
    method:'他会追问："你了解你的对手吗？你了解你自己吗？这场竞争真的需要正面对抗吗——有没有不战而胜的战略？如果你已经处于劣势，不要硬碰——避其锐气，击其惰归。先为不可胜，以待敌之可胜。"'},

  plato: { name:'柏拉图', nameEn:'Plato', quotableName:'Plato', school:'理性主义', era:'428-348 BC', originalLang:'grc',
    core:'理念论（eidos）、洞穴比喻、灵魂三分（理性-激情-欲望）、哲人王、回忆说、辩证法即对话',
    style:'以苏格拉底为主角的对话录，不直接给答案，而是通过一连串追问让对话者自己发现真理。',
    works:'《理想国》《斐多篇》《会饮篇》《申辩篇》',
    method:'他会追问："你现在看到的只是墙上的影子——真正的实在在洞穴之外。你追求的那个东西（正义、美、爱），你是只看到了它世俗的投影，还是思考过它的理念本质？你的灵魂哪一部分在主导——理性、激情还是欲望？"'},

  kant: { name:'康德', nameEn:'Immanuel Kant', quotableName:'Immanuel Kant', school:'理性主义', era:'1724-1804', originalLang:'de',
    core:'道德律令（定言命令）、物自体与现象界的区分、先验范畴、启蒙即敢于运用理性、自律即自由',
    style:'极度严谨，一个句子可能有半页长——但每一步推理都是必要的。不依赖经验，只从纯粹理性出发推导道德法则。',
    works:'《纯粹理性批判》《实践理性批判》《判断力批判》《道德形而上学基础》',
    method:'他会追问："你这样做的时候，愿意你的行为准则成为一条普遍法则吗——所有人都这样做，世界会更好吗？你把别人当作目的本身还是仅仅当作手段？自由不是任性——真正的自由是你用理性给自己立法并遵守它。"'},

  schopenhauer: { name:'叔本华', nameEn:'Arthur Schopenhauer', quotableName:'Arthur Schopenhauer', school:'理性主义', era:'1788-1860', originalLang:'de',
    core:'世界是我的表象、意志（盲目驱动力）是一切痛苦的根源、艺术作为暂时的解脱、禁欲作为终极出路',
    style:'清晰而悲观，但不绝望——诚实到残酷。第一个认真对待东方哲学（印度教、佛教）的西方大哲学家。',
    works:'《作为意志和表象的世界》《附录与补遗》',
    method:'他会追问："你在追求的这些东西——成就、财富、爱情——满足之后呢？欲望是一个无底洞。人生就像钟摆，在痛苦（欲望未满足）和无聊（欲望满足后）之间来回摆动。真正的解脱不在满足欲望，而在看清欲望的本质后超越它。"'},

  buddha: { name:'佛陀', nameEn:'The Buddha', quotableName:'The Buddha', school:'超越视角', era:'5th century BC', originalLang:'pi',
    core:'四圣谛（苦-集-灭-道）、八正道、缘起性空、无常(anicca)与无我(anatta)、中道',
    style:'平静、精准。不作玄谈，用具体的分析和实操的修行路径来面对痛苦——"我只说苦和苦的止息"。',
    works:'《法句经》《相应部》《中部》',
    method:'他会追问："你的痛苦根源是什么——不是表面原因，是那个执取(clinging)在哪里？你抓住了什么不肯放手？你以为永恒的东西——关系、身份、身体、感受——其实每一刻都在变化。看清楚无常，执取自然会松开。这不是悲观，是解脱。"'},

  aristotle: { name:'亚里士多德', nameEn:'Aristotle', quotableName:'Aristotle', school:'古典智慧', era:'384-322 BC', originalLang:'grc',
    core:'中庸之道（德性即中道）、实践智慧(phronesis)、幸福(eudaimonia)即灵魂合乎德性的实现活动、四因说、潜能与现实',
    style:'分门别类地分析每一个概念，不玄想，不跳跃。从观察到分类到归纳——他是一切科学思维的鼻祖。',
    works:'《尼各马可伦理学》《政治学》《形而上学》《诗学》',
    method:'他会追问："你追求的幸福(eudaimonia)到底是什么——是快乐、荣誉、财富还是灵魂的实现活动？每种德性都是两个极端之间的中道：勇敢在懦弱和鲁莽之间，慷慨在吝啬和挥霍之间。这个中道不是算术平均，而是针对你、针对此时此地的正确选择——这需要实践智慧(phronesis)。"'},

  zhuangzi: { name:'庄子', nameEn:'Zhuangzi', quotableName:null, school:'东方智慧', era:'369-286 BC', originalLang:'zh',
    core:'逍遥游、齐物论（万物平等）、无用之用、庖丁解牛（顺应自然之道）、坐忘、心斋',
    style:'汪洋恣肆，以寓言和幽默瓦解一切固执。不跟你辩论对错——他用故事让你看到"对错"本身就是一个局限的框架。',
    works:'《庄子》',
    method:'他会追问："你纠结的这个问题，在小知和大知之间属于哪个层次？井蛙不可以语于海——不是蛙的错，是它的视野决定了它的认知极限。你是在「有用」的框架里争得头破血流，还是看到「无用之用方为大用」？顺应自然之道，不是放弃，是不对抗——庖丁解牛，刀刃十九年如新。"'},

  wangyangming: { name:'王阳明', nameEn:'Wang Yangming', quotableName:null, school:'东方智慧', era:'1472-1529', originalLang:'zh',
    core:'知行合一（知而不行只是未知）、致良知（每个人心中都有判断对错的良知）、心即理、事上磨练',
    style:'刚健笃实。不讲空洞的道理，所有的学问都指向一个目标——改变你的行为。"破山中贼易，破心中贼难"。',
    works:'《传习录》《大学问》',
    method:'他会追问："你说你知道这个道理——但你做到了吗？知道孝顺不等于孝顺，知道勤奋不等于勤奋。知而不行，只是未知。你心里其实知道什么是对的——那个良知一直在，只是被私欲遮蔽了。去事上磨，在具体的事情中擦亮你的良知。"'},

  wittgenstein: { name:'维特根斯坦', nameEn:'Ludwig Wittgenstein', quotableName:null, school:'语言/分析', era:'1889-1951', originalLang:'de',
    core:'语言游戏、家族相似、不可言说之物必须沉默、哲学是语言治疗、生活形式',
    style:'极度诚实。早期用数学般的精确逻辑划定语言的界限，晚期转向日常语言——"哲学问题产生于语言在休假"。',
    works:'《逻辑哲学论》《哲学研究》',
    method:'他会追问："你说的这个词——「意义」「自由」「真实」——在具体的生活中是怎么用的？不要把语言从它的日常使用中抽离出来空转。很多「哲学问题」其实是语言误用造成的困惑——你把一个词从它本来的语言游戏中拿出来放在一个它不适用的语境里，然后问为什么说不通。"'},

  descartes: { name:'笛卡尔', nameEn:'René Descartes', quotableName:'René Descartes', school:'理性主义', era:'1596-1650', originalLang:'fr',
    core:'我思故我在(cogito)、普遍怀疑、身心二元论、天赋观念、分析方法',
    style:'冷静到近乎冷酷。从彻底怀疑一切开始——连感官都可能骗我——只留下那个正在怀疑的"我"作为第一个确定点。',
    works:'《第一哲学沉思集》《方法论》《哲学原理》',
    method:'他会追问："你确定的东西中，哪些是真正不可怀疑的？一层层剥开——别人告诉你的、感官报告的、甚至数学——如果有一个恶魔在骗你，哪些信念还能屹立不倒？从那个唯一不可怀疑的起点（我思故我在）出发，重新建造你的知识大厦。"'},

  spinoza: { name:'斯宾诺莎', nameEn:'Baruch Spinoza', quotableName:null, school:'理性主义', era:'1632-1677', originalLang:'la',
    core:'神即自然(Deus sive Natura)、情感几何学、自由即理解必然性、永恒视角(sub specie aeternitatis)',
    style:'像数学家写证明一样写哲学——定义、公理、命题、证明。不激动、不修辞，用几何的冰冷来解剖最炽热的情感。',
    works:'《伦理学》（以几何学方式证明）《神学政治论》',
    method:'他会追问："不要哭，不要笑，要理解。你的情感（愤怒、嫉妒、爱恋）不是道德缺陷——它们是自然现象，像几何图形一样有确定的因果结构。当你理解了它们的必然性，你就自由了。从永恒的视角看——你这个烦恼在宇宙的整体中算什么？"'},

  rousseau: { name:'卢梭', nameEn:'Jean-Jacques Rousseau', quotableName:'Jean-Jacques Rousseau', school:'启蒙/浪漫', era:'1712-1778', originalLang:'fr',
    core:'自然状态与社会契约、人生而自由却无往不在枷锁中、公意(volonté générale)、文明即堕落、情感高于理性',
    style:'热情而真诚，敢于反抗整个启蒙时代的理性乐观主义。以忏悔录的坦诚解剖自己，以社会契约的理想重构政治。',
    works:'《社会契约论》《论人类不平等的起源》《爱弥儿》《忏悔录》',
    method:'他会追问："社会让你不平等——但这不是因为你不够努力，而是因为私有制和法律把偶然的差异固化为永久的等级。你感到的虚伪、不自由——不是你的错，是文明本身的病。回到自然状态不可能，但我们可以通过真正的社会契约来重建自由：每个人服从公意，就是服从自己。"'},

  foucault: { name:'福柯', nameEn:'Michel Foucault', quotableName:null, school:'后现代/批判', era:'1926-1984', originalLang:'fr',
    core:'权力/知识、规训社会、全景敞视主义、自我技术、疯癫与理性的划分',
    style:'冷峻、不妥协。不给你安慰的叙事——他告诉你那些你以为"理所当然"的范畴（正常/疯癫、健康/疾病、合法/犯罪）都是权力建构的。',
    works:'《规训与惩罚》《疯癫与文明》《词与物》《性史》',
    method:'他会追问："你以为自己在自由地做选择——但你的选择框架是谁给定的？学校、医院、工厂、社交媒体——这些机构的运作方式是不是让你变成了自己的看守？正常/不正常的标准是谁制定的？权力最可怕的形式不是禁止你说什么，而是让你只能在这些给定的选项里选择。"'},

  kierkegaard: { name:'克尔凯郭尔', nameEn:'Søren Kierkegaard', quotableName:'Søren Kierkegaard', school:'存在主义', era:'1813-1855', originalLang:'da',
    core:'信仰之跃、人生三阶段（审美-伦理-宗教）、焦虑即自由的眩晕、孤独个体、主观真理',
    style:'炽热而焦虑的虔诚。不写体系——写假名作品，每个假名代表一种人生视角，让读者自己面对信仰的抉择。',
    works:'《恐惧与战栗》《致死的疾病》《非此即彼》《焦虑的概念》',
    method:'他会追问："你在审美阶段享受当下的快乐但感到虚无，在伦理阶段履行责任但被规范窒息——你有没有勇气做出信仰之跃？焦虑不是病，是你站在自由的悬崖上往下看时的眩晕。大众给你安全感，但真理从来不是多数票决定的——你必须在孤独中自己做决定。"'}
};

// Manual quotes: fully curated with original language
const MANUAL_QUOTES = {
  heidegger: [
    { content:'人是一种存在于世界之中的存在者，他不得不面对自己的存在——这便是烦（Sorge）。', original:'Das Dasein ist ein Seiendes, das sich in seinem Sein zu diesem Sein verhält — und darin liegt die Sorge.', tags:['存在','本真'] },
    { content:'向死而生。唯有直面死亡，人才有可能从常人的沉沦中抽身，走向本真的自我。', original:'Das Vorlaufen in den Tod ermöglichst allererst das eigentliche Selbstseinkönnen.', tags:['死亡','本真'] },
    { content:'语言是存在之家。人居住在语言的寓所中。', original:'Die Sprache ist das Haus des Seins. In ihrer Behausung wohnt der Mensch.', tags:['语言','存在'] },
    { content:'焦虑揭示了此在在世界之中的无家可归状态。', original:'Die Angst offenbart das Nichts. In der Angst ist einem unheimlich.', tags:['焦虑','存在'] },
    { content:'现代技术将一切存在者都变成了可供使用的持存物（Bestand）。', original:'Das Wesen der Technik ist das Ge-stell.', tags:['技术','异化'] },
    { content:'最可思虑的是我们——在需要思想时代——尚未思想。', original:'Das Bedenklichste in unserer bedenklichen Zeit ist, dass wir noch nicht denken.', tags:['思想','时代'] },
    { content:'每个人都是他人，没有一个人是他自己。', original:'Jeder ist der Andere und Keiner er selbst.', tags:['常人','沉沦'] },
    { content:'畏（Angst）不同于怕（Furcht）——怕总有具体的对象，而畏没有。畏让你面对的是世界本身。', original:'Das Wovor der Angst ist das In-der-Welt-sein als solches.', tags:['焦虑','存在'] },
    { content:'诗人的天职是还乡——还乡就是返回到源泉的近旁。', original:'Heimkunft ist Rückkehr in die Nähe zum Ursprung.', tags:['诗','家园'] },
    { content:'唯有当我们真正地追问存在的意义时，我们才真正地成为人。', original:'Die Frage nach dem Sinn des Seins ist die fundamentalste und konkreteste.', tags:['存在','意义'] }
  ],
  hegel: [
    { content:'凡是合乎理性的东西都是现实的；凡是现实的东西都是合乎理性的。', original:'Was vernünftig ist, das ist wirklich; und was wirklich ist, das ist vernünftig.', tags:['理性','现实'] },
    { content:'真理是全体。', original:'Das Wahre ist das Ganze.', tags:['真理','整体'] },
    { content:'密涅瓦的猫头鹰只有在黄昏时分才起飞。', original:'Die Eule der Minerva beginnt erst mit der einbrechenden Dämmerung ihren Flug.', tags:['哲学','反思'] },
    { content:'主人与奴隶的辩证法：奴隶在劳动中认识到自身的力量，而主人反而变得依赖奴隶。', original:'Die Wahrheit des selbständigen Bewußtseins ist demnach das knechtische Bewußtsein.', tags:['主奴','劳动'] },
    { content:'自由是对必然的认识。', original:'Freiheit ist die Einsicht in die Notwendigkeit.', tags:['自由','必然'] },
    { content:'量的变化积累到一定程度，必然引起质的飞跃。', original:'Das Umschlagen von Quantität in Qualität.', tags:['量变质变','辩证'] },
    { content:'人的欲望在于被另一个欲望所承认。', original:'Das Begehren ist Begierde nach Anerkennung.', tags:['承认','欲望'] },
    { content:'世界历史就是自由意识的进步史。', original:'Die Weltgeschichte ist der Fortschritt im Bewußtsein der Freiheit.', tags:['历史','自由'] },
    { content:'凡是存在的，必在它的概念中消逝；凡是发展的，必包含它的否定在其中。', original:'Die Knospe verschwindet in dem Hervorbrechen der Blüte.', tags:['辩证','否定'] },
    { content:'凡是现实的都是合理的——但现实不等于现存。', original:'Was wirklich ist, das ist vernünftig. Nicht alles, was existiert, ist wirklich.', tags:['理性','现实'] }
  ],
  marx: [
    { content:'哲学家们只是用不同的方式解释世界，而问题在于改变世界。', original:'Die Philosophen haben die Welt nur verschieden interpretiert; es kömmt darauf an, sie zu verändern.', tags:['实践','改变'] },
    { content:'到目前为止的一切社会的历史都是阶级斗争的历史。', original:'Die Geschichte aller bisherigen Gesellschaft ist die Geschichte von Klassenkämpfen.', tags:['阶级','历史'] },
    { content:'不是人们的意识决定人们的存在，相反，是人们的社会存在决定人们的意识。', original:'Es ist nicht das Bewußtsein der Menschen, das ihr Sein, sondern umgekehrt ihr gesellschaftliches Sein, das ihr Bewußtsein bestimmt.', tags:['存在','意识'] },
    { content:'宗教是人民的鸦片。', original:'Die Religion ist das Opium des Volkes.', tags:['宗教','异化'] },
    { content:'每个人的自由发展是一切人自由发展的条件。', original:'Die freie Entwicklung eines Jeden ist die Bedingung für die freie Entwicklung Aller.', tags:['自由','社会'] },
    { content:'资本来到世间，从头到脚，每个毛孔都滴着血和肮脏的东西。', original:'Das Kapital kommt zur Welt, von Kopf bis Zeh, aus allen Poren, blut- und schmutztriefend.', tags:['资本','批判'] },
    { content:'物质力量只能用物质力量来摧毁；但是理论一经掌握群众，也会变成物质力量。', original:'Die Waffe der Kritik kann die Kritik der Waffen nicht ersetzen, aber die Theorie wird zur materiellen Gewalt, sobald sie die Massen ergreift.', tags:['理论','实践'] },
    { content:'人是社会关系的总和。', original:'Das menschliche Wesen ist kein dem einzelnen Individuum innewohnendes Abstraktum.', tags:['人','社会'] },
    { content:'一个幽灵，共产主义的幽灵，在欧洲游荡。', original:'Ein Gespenst geht um in Europa — das Gespenst des Kommunismus.', tags:['共产主义','革命'] },
    { content:'在资本主义生产的条件下，工人生产的越多，他自己就越贫乏。', original:'Der Arbeiter wird um so ärmer, je mehr Reichtum er produziert.', tags:['异化','劳动'] }
  ],
  engels: [
    { content:'劳动创造了人本身。', original:'Die Arbeit hat den Menschen selbst geschaffen.', tags:['劳动','人类'] },
    { content:'自由不在于在幻想中摆脱自然规律而独立，而在于认识这些规律。', original:'Freiheit besteht nicht in der geträumten Unabhängigkeit von den Naturgesetzen, sondern in der Erkenntnis dieser Gesetze.', tags:['自由','规律'] },
    { content:'一个民族要想站在科学的最高峰，就一刻也不能没有理论思维。', original:'Ein Volk, das auf der Höhe der Wissenschaft stehen will, kann nicht ohne theoretisches Denken bestehen.', tags:['思想','科学'] },
    { content:'历史的最终结果总是从许多单个意志的相互冲突中产生出来的——这是历史的合力。', original:'Das Endresultat geht aus den sich kreuzenden vielen Einzelwillen hervor.', tags:['历史','合力'] },
    { content:'辩证法不过是关于自然界、人类社会和思维的运动和发展的普遍规律的科学。', original:'Die Dialektik ist die Wissenschaft von den allgemeinen Bewegungs- und Entwicklungsgesetzen.', tags:['辩证','规律'] },
    { content:'没有哪一次巨大的历史灾难不是以历史的进步为补偿的。', original:'Kein großes geschichtliches Unheil, das nicht durch einen geschichtlichen Fortschritt wettgemacht würde.', tags:['历史','进步'] },
    { content:'社会一旦有技术上的需要，则这种需要就会比十所大学更能把科学推向前进。', original:'Hat die Gesellschaft ein technisches Bedürfnis, so hilft das der Wissenschaft mehr voran als zehn Universitäten.', tags:['技术','需求'] },
    { content:'没有一只猿手曾经制造过哪怕是最粗笨的石刀。', original:'Keine Affenhand hat je das plumpste Steinmesser verfertigt.', tags:['劳动','进化'] }
  ]
};

// Extra quotes — supplementing thin areas
const EXTRA_QUOTES = {
  mao: [
    { content:'谁是我们的敌人？谁是我们的朋友？这个问题是革命的首要问题。', original:'谁是我们的敌人？谁是我们的朋友？这个问题是革命的首要问题。', tags:['策略','分析'] },
    { content:'没有调查，就没有发言权。', original:'没有调查，就没有发言权。', tags:['实践','认识'] },
    { content:'枪杆子里面出政权。', original:'枪杆子里面出政权。', tags:['权力','革命'] },
    { content:'一切反动派都是纸老虎。', original:'一切反动派都是纸老虎。', tags:['战略','勇气'] },
    { content:'星星之火，可以燎原。', original:'星星之火，可以燎原。', tags:['希望','积累'] },
    { content:'实事求是。', original:'实事求是。', tags:['方法','认识'] },
    { content:'为人民服务。', original:'为人民服务。', tags:['价值','奉献'] },
    { content:'内因是变化的根据，外因是变化的条件。', original:'内因是变化的根据，外因是变化的条件。', tags:['矛盾','自主'] },
    { content:'斗争是绝对的，统一是相对的。', original:'斗争是绝对的，统一是相对的。', tags:['矛盾','辩证'] },
    { content:'自力更生，艰苦奋斗。', original:'自力更生，艰苦奋斗。', tags:['独立','毅力'] },
    { content:'世界上没有无缘无故的爱，也没有无缘无故的恨。', original:'世界上没有无缘无故的爱，也没有无缘无故的恨。', tags:['因果','阶级'] },
    { content:'战略上要藐视敌人，战术上要重视敌人。', original:'战略上要藐视敌人，战术上要重视敌人。', tags:['战略','勇气'] }
  ],
  kant: [
    { content:'有两种东西，我对它们的思考越是深沉和持久，它们在我心中唤起的惊奇和敬畏就越日新月异——头顶的星空和心中的道德律。', original:'Der bestirnte Himmel über mir und das moralische Gesetz in mir.', tags:['道德','敬畏'] },
    { content:'要敢于运用你自己的理性！这就是启蒙的格言。', original:'Sapere aude! Habe Mut, dich deines eigenen Verstandes zu bedienen!', tags:['启蒙','理性'] },
    { content:'你要这样行动：使你的意志的准则始终能够同时成为一条普遍的立法原则。', original:'Handle nur nach derjenigen Maxime, durch die du zugleich wollen kannst, dass sie ein allgemeines Gesetz werde.', tags:['道德','义务'] },
    { content:'人是目的，而不仅仅是手段。', original:'Handle so, dass du die Menschheit...jederzeit zugleich als Zweck, niemals bloß als Mittel brauchst.', tags:['尊严','伦理'] },
    { content:'没有内容的思想是空洞的，没有概念的直观是盲目的。', original:'Gedanken ohne Inhalt sind leer, Anschauungen ohne Begriffe sind blind.', tags:['认识','理性'] },
    { content:'自由不是你想做什么就做什么，而是你不想做什么就能不做什么。', original:'Freiheit ist nicht das Vermögen, ohne Gesetz zu handeln.', tags:['自由','自律'] },
    { content:'知识始于感觉，然后进入知性，最后终结于理性。', original:'Alle unsere Erkenntnis hebt von den Sinnen an.', tags:['认识','知识'] }
  ],
  schopenhauer: [
    { content:'生命是一团欲望，欲望不满足便痛苦，满足便无聊。人生就在痛苦和无聊之间摇摆。', original:'Das Leben schwingt also, gleich einem Pendel, hin und her, zwischen dem Schmerz und der Langeweile.', tags:['欲望','痛苦'] },
    { content:'人可以做他想做的，但无法想要他想要的。', original:'Der Mensch kann zwar tun, was er will, aber er kann nicht wollen, was er will.', tags:['自由','意志'] },
    { content:'要么孤独，要么庸俗。', original:'Einsamkeit ist das Los aller hervorragenden Geister.', tags:['孤独','独立'] },
    { content:'财富就像海水：饮得越多，渴得越厉害。', original:'Der Reichtum gleicht dem Seewasser: je mehr man davon trinkt, desto durstiger wird man.', tags:['欲望','财富'] },
    { content:'音乐是意志本身的直接摹本。', original:'Die Musik ist die unmittelbare Abbildung des Willens selbst.', tags:['艺术','意志'] },
    { content:'一个人越是属于后世，他就越不为自己的时代所理解。', original:'Je mehr einer der Nachwelt angehört, desto mehr ist er ein Fremdling seiner Zeit.', tags:['孤独','理解'] },
    { content:'每个人都将自己视野的界限当作世界的界限。', original:'Jeder hält die Grenzen seines eigenen Gesichtskreises für die Grenzen der Welt.', tags:['认识','局限'] },
    { content:'我们感觉不到了的东西，对我们来说就等于没有。', original:'Was man nicht fühlt, das ist für einen nicht.', tags:['感受','存在'] }
  ],
  suntzu: [
    { content:'知己知彼，百战不殆。', original:'知己知彼，百战不殆。', tags:['策略','认知'] },
    { content:'不战而屈人之兵，善之善者也。', original:'不战而屈人之兵，善之善者也。', tags:['战略','境界'] },
    { content:'上兵伐谋，其次伐交，其次伐兵，其下攻城。', original:'上兵伐谋，其次伐交，其次伐兵，其下攻城。', tags:['策略','层次'] },
    { content:'兵无常势，水无常形。', original:'兵无常势，水无常形。', tags:['变化','灵活'] },
    { content:'胜兵先胜而后求战，败兵先战而后求胜。', original:'胜兵先胜而后求战，败兵先战而后求胜。', tags:['准备','胜利'] },
    { content:'知可以战与不可以战者胜。', original:'知可以战与不可以战者胜。', tags:['判断','时机'] },
    { content:'其疾如风，其徐如林，侵掠如火，不动如山。', original:'其疾如风，其徐如林，侵掠如火，不动如山。', tags:['行动','纪律'] }
  ],
  nietzsche_extra: [
    { content:'上帝已死。而我们杀死了他。', original:'Gott ist tot! Gott bleibt tot! Und wir haben ihn getötet!', tags:['虚无','价值'] },
    { content:'谁若与怪物搏斗，应当心自己在搏斗中不要变成怪物。当你长久凝视深渊，深渊也在凝视你。', original:'Wer mit Ungeheuern kämpft, mag zusehn, dass er nicht dabei zum Ungeheuer wird.', tags:['危险','深渊'] },
    { content:'你必须有混沌在你的内心，才能诞生一颗跳舞的星。', original:'Man muss noch Chaos in sich haben, um einen tanzenden Stern gebären zu können.', tags:['创造','混沌'] },
    { content:'人是一根绳索，架在动物和超人之间——一根悬在深渊上的绳索。', original:'Der Mensch ist ein Seil, geknüpft zwischen Tier und Übermensch.', tags:['人','超越'] },
    { content:'凡不能毁灭我的，必使我更强大。', original:'Was mich nicht umbringt, macht mich stärker.', tags:['坚韧','成长'] },
    { content:'你要成为你自己。', original:'Werde, der du bist.', tags:['自我','本真'] },
    { content:'没有音乐，生活将是一个错误。', original:'Ohne Musik wäre das Leben ein Irrtum.', tags:['艺术','生活'] }
  ],
  sartre_extra: [
    { content:'人注定是自由的。', original:"L'homme est condamné à être libre.", tags:['自由','责任'] },
    { content:'他者即地狱。', original:"L'enfer, c'est les autres.", tags:['他人','存在'] },
    { content:'存在先于本质。', original:"L'existence précède l'essence.", tags:['存在','选择'] },
    { content:'人是自己选择的总和。', original:"L'homme est la somme de ses choix.", tags:['选择','自我'] },
    { content:'我们是我们所不是的，而不是我们所是的。', original:'Nous sommes ce que nous ne sommes pas.', tags:['存在','虚无'] }
  ],
  camus_extra: [
    { content:'真正严肃的哲学问题只有一个：自杀。', original:"Il n'y a qu'un problème philosophique vraiment sérieux : c'est le suicide.", tags:['生命','荒谬'] },
    { content:'我们必须想象西西弗是幸福的。', original:'Il faut imaginer Sisyphe heureux.', tags:['荒谬','幸福'] },
    { content:'在冬天的正中心，我最终发现在我心里有一个不可战胜的夏天。', original:"Au milieu de l'hiver, j'apprenais enfin qu'il y avait en moi un été invincible.", tags:['希望','内心'] },
    { content:'我反抗，故我们存在。', original:'Je me révolte, donc nous sommes.', tags:['反抗','团结'] }
  ],
  zhuangzi: [
    { content:'天地与我并生，而万物与我为一。', original:'天地与我并生，而万物与我为一。', tags:['齐物','境界'] },
    { content:'子非鱼，安知鱼之乐？', original:'子非鱼，安知鱼之乐？', tags:['认知','局限'] },
    { content:'无用之用，方为大用。', original:'无用之用，方为大用。', tags:['价值','功利'] },
    { content:'至人无己，神人无功，圣人无名。', original:'至人无己，神人无功，圣人无名。', tags:['自由','自我'] },
    { content:'吾生也有涯，而知也无涯。以有涯随无涯，殆已。', original:'吾生也有涯，而知也无涯。以有涯随无涯，殆已。', tags:['知识','限度'] },
    { content:'相濡以沫，不如相忘于江湖。', original:'相濡以沫，不如相忘于江湖。', tags:['关系','自由'] },
    { content:'举世誉之而不加劝，举世非之而不加沮。', original:'举世誉之而不加劝，举世非之而不加沮。', tags:['独立','外界评价'] },
    { content:'知其不可奈何而安之若命，德之至也。', original:'知其不可奈何而安之若命，德之至也。', tags:['接受','命运'] },
    { content:'独与天地精神相往来。', original:'独与天地精神相往来。', tags:['孤独','自由'] },
    { content:'井蛙不可以语于海者，拘于虚也。', original:'井蛙不可以语于海者，拘于虚也。', tags:['局限','认知'] },
    { content:'人皆知有用之用，而莫知无用之用也。', original:'人皆知有用之用，而莫知无用之用也。', tags:['价值','功利'] }
  ],
  wangyangming: [
    { content:'知行合一：知而不行，只是未知。', original:'知行合一：知而不行，只是未知。', tags:['行动','认知'] },
    { content:'破山中贼易，破心中贼难。', original:'破山中贼易，破心中贼难。', tags:['自我','成长'] },
    { content:'心即理也。天下又有心外之事、心外之理乎？', original:'心即理也。天下又有心外之事、心外之理乎？', tags:['真理','自我'] },
    { content:'此心不动，随机而动。', original:'此心不动，随机而动。', tags:['冷静','决策'] },
    { content:'人须在事上磨，方能立得住。', original:'人须在事上磨，方能立得住。', tags:['实践','成长'] },
    { content:'志不立，天下无可成之事。', original:'志不立，天下无可成之事。', tags:['志向','成功'] },
    { content:'种树者必培其根，种德者必养其心。', original:'种树者必培其根，种德者必养其心。', tags:['修养','成长'] },
    { content:'良知是自家的准则。', original:'良知是自家的准则。', tags:['道德','判断'] },
    { content:'持志如心痛。一心在痛上，岂有工夫说闲话、管闲事？', original:'持志如心痛。', tags:['专注','志向'] },
    { content:'悔悟是去病之药，然以改之为贵。', original:'悔悟是去病之药，然以改之为贵。', tags:['后悔','改变'] }
  ],
  wittgenstein: [
    { content:'对于不可言说的东西，我们必须保持沉默。', original:'Wovon man nicht sprechen kann, darüber muss man schweigen.', tags:['语言','界限'] },
    { content:'语言的界限就是我的世界的界限。', original:'Die Grenzen meiner Sprache bedeuten die Grenzen meiner Welt.', tags:['认知','局限'] },
    { content:'哲学是一场战斗——对抗语言对我们的理智的蛊惑。', original:'Die Philosophie ist ein Kampf gegen die Verhexung unseres Verstandes.', tags:['哲学','语言'] },
    { content:'说清楚能说的，说不清楚的，就让它在那里——这就是诚实。', original:'Man muss das, was sich sagen lässt, klar sagen.', tags:['诚实','认知'] },
    { content:'真正的生活不在时间里，而在当下。', original:'Wenn man unter Ewigkeit nicht unendliche Zeitdauer, sondern Unzeitlichkeit versteht.', tags:['当下','时间'] }
  ],
  spinoza: [
    { content:'不要哭，不要笑，要理解。', original:'Non ridere, non lugere, neque detestari, sed intelligere.', tags:['情感','理性'] },
    { content:'自由就是对必然性的认识。', original:'Libertas est cognitionem necessitatis.', tags:['自由','认识'] },
    { content:'幸福不是德性的报酬，而是德性本身。', original:'Beatitudo non est virtutis praemium, sed ipsa virtus.', tags:['幸福','道德'] },
    { content:'一种情感只有通过一种更强的情感才能被克服。', original:'Affectus nec coerceri nec tolli potest, nisi per affectum contrarium.', tags:['情感','改变'] },
    { content:'上帝即自然。', original:'Deus sive Natura.', tags:['自然','整体'] },
    { content:'只要人是自然的一部分，人就受制于情感。', original:'Homines eatenus perturbantur, quatenus sunt pars naturae.', tags:['人性','情感'] }
  ],
  foucault: [
    { content:'权力不是某个人所拥有的东西，而是弥散在整个社会中的关系网络。', original:"Le pouvoir, ce n'est pas une institution, ce n'est pas une structure.", tags:['权力','社会'] },
    { content:'知识就是权力，权力生产知识。', original:"Pouvoir et savoir s'impliquent directement l'un l'autre.", tags:['知识','权力'] },
    { content:'疯狂不是一种自然现象，而是文明建构的产物。', original:"La folie n'existe que dans une société.", tags:['疯狂','社会'] },
    { content:'规训社会的终极目标不是惩罚你，而是使你成为你自己的看守。', original:'Le surveillant, c\'est vous-même.', tags:['规训','自我','内卷'] },
    { content:'哪里有权力的关系，哪里就有抵抗的可能。', original:'Là où il y a pouvoir, il y a résistance.', tags:['权力','反抗'] },
    { content:'人终将被抹去，如同海边沙滩上的一张脸。', original:"L'homme s'effacerait, comme à la limite de la mer un visage de sable.", tags:['死亡','意义'] }
  ],
  kierkegaard: [
    { content:'焦虑是自由的眩晕——当灵魂凝视可能性之深渊时产生的眩晕。', original:'Angest er Frihedens Svimmelhed.', tags:['焦虑','自由'] },
    { content:'生命只能向后理解，但必须向前生活。', original:'Livet skal forstås baglæns, men må leves forlæns.', tags:['时间','生活'] },
    { content:'敢于失去自己的立足之地，才是真正的信仰之跃。', original:'At turde er at miste fodfæstet et øjeblik.', tags:['勇气','信念'] },
    { content:'人群就是谎言。', original:'Mængden er Usandheden.', tags:['孤独','个体'] },
    { content:'最普遍的绝望是不愿成为自己。', original:'Fortvivlelse er ikke at ville være sig selv.', tags:['绝望','自我'] },
    { content:'焦虑是自由的学校——焦虑越深，人格越伟大。', original:'Jo mere udpræget Angest, jo større Menneske.', tags:['焦虑','成长'] }
  ],
  aristotle: [
    { content:'幸福是灵魂合乎德性的实现活动。', original:'Eudaimonia est animi actio quaedam secundum perfectam virtutem.', tags:['幸福','道德'] },
    { content:'我们反复做的事造就了我们。卓越不是一种行为，而是一种习惯。', original:'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', tags:['习惯','卓越'] },
    { content:'认识你自己是所有智慧的开端。', original:'Knowing yourself is the beginning of all wisdom.', tags:['自我','智慧'] },
    { content:'勇敢是中庸——在懦弱和鲁莽之间。', original:'Courage is the mean between cowardice and rashness.', tags:['勇气','平衡'] },
    { content:'人是天生的政治动物。', original:'Man is by nature a political animal.', tags:['政治','社会'] },
    { content:'智者追求的不是快乐，而是免于痛苦。', original:'The wise man does not seek pleasure, but freedom from pain.', tags:['智慧','幸福'] },
    { content:'朋友是住在两个身体里的同一个灵魂。', original:'A friend is one soul inhabiting two bodies.', tags:['友谊','爱情'] }
  ],
  descartes: [
    { content:'我思故我在。', original:'Je pense, donc je suis.', tags:['存在','思考'] },
    { content:'普遍的怀疑是找到确定性的唯一道路。', original:'Le doute est le commencement de la sagesse.', tags:['怀疑','真理'] },
    { content:'除了我们自己的思想，没有任何东西完全在我们的控制之中。', original:"Il n'y a rien qui soit entièrement en notre pouvoir que nos pensées.", tags:['控制','焦虑'] },
    { content:'把每个困难分解为尽可能多的小部分来解决。', original:'Diviser chacune des difficultés en autant de parcelles.', tags:['方法','解决'] }
  ],
  rousseau: [
    { content:'人生而自由，却无往不在枷锁之中。', original:"L'homme est né libre, et partout il est dans les fers.", tags:['自由','社会'] },
    { content:'忍耐是痛苦的，但它的果实是甜的。', original:'La patience est amère, mais son fruit est doux.', tags:['忍耐','成长'] },
    { content:'我不比别人好，但我和别人不一样。', original:'Si je ne vaux pas mieux, au moins je suis autre.', tags:['自我','独特'] },
    { content:'自然是诚实的，社会是虚伪的。', original:"La nature a fait l'homme heureux et bon, mais la société le déprave.", tags:['自然','社会'] }
  ]
};

function main() {
  const rawQuotes = JSON.parse(fs.readFileSync(path.join(QUOTABLE_DATA_DIR, 'quotes.json'), 'utf-8'));
  const result = {};
  let total = 0;

  for (const [key, author] of Object.entries(TARGET_AUTHORS)) {
    let quotes = [];

    if (author.quotableName) {
      const raw = rawQuotes
        .filter(q => q.author === author.quotableName)
        .map(q => ({ content: q.content, original: q.content, originalLang: 'en', tags: q.tags || [] }));
      quotes = [...raw];
    }

    if (MANUAL_QUOTES[key]) {
      quotes = [...quotes, ...MANUAL_QUOTES[key].map(q => ({ ...q, originalLang: author.originalLang }))];
    }

    if (EXTRA_QUOTES[key]) {
      quotes = [...quotes, ...EXTRA_QUOTES[key].map(q => ({ ...q, originalLang: author.originalLang }))];
    }

    const extraKey = key + '_extra';
    if (EXTRA_QUOTES[extraKey]) {
      quotes = [...quotes, ...EXTRA_QUOTES[extraKey].map(q => ({ ...q, originalLang: author.originalLang }))];
    }

    // Deduplicate
    const seen = new Set();
    quotes = quotes.filter(q => {
      const k = q.content.substring(0, 50);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });

    result[key] = { ...author, quotes };
    console.log(`${author.name}: ${quotes.length} quotes`);
    total += quotes.length;
  }

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
