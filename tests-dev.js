// Tests of many features used during the development

// direct import from the sources, but unfortunately 
// to use it BUILDTIME (line 43 of src/jsRealB.js)  must be replaced by a "real" value
// that is set by the webpack DefinePlugin
// when building with webpack, change that value to BUILDTIME so that the DefinePlugin works
// import {Constituent, N,A,Pro,D,V,Adv,C,P,DT,NO,Q,
//         S,NP,AP,VP,AdvP,PP,CP,SP,
//         root, subj, det, mod, comp, coord,
//         loadFr,loadEn,addToLexicon,getLanguage,getLemma,
//         testWarnings,
//         fromJSON,ppJSON} from "./src/jsRealB.js"

// use the webpack module
import jsRealB from "./dist/jsRealB.js";
Object.assign(globalThis,jsRealB);

console.log(`jsRealB_version:${jsRealB_version}, date:${jsRealB_dateCreated}`)
loadFr();
addToLexicon({"John":{"N":{"g":"m","tab":"n4"}}})
addToLexicon({"Mary":{"N":{"g":"f","tab":"n16"}}})
var pomme = NP(D("le"),N("pomme"));
var  gars = NP(D("le"),N("garçon").n("p"));

var exemplesFr=[
    [N("chat"),
        "chat"],
    [Pro("moi").c("acc"),
        "me"],
    [Pro("moi").tn(""),
        "moi"],
    [NP(D("le"),N("chat")),
        "le chat"],
    [S(NP(D('le'),N('chat').n("p"))),
        "Les chats. "],
    [V("aller").t("ps").pe(2).n("p"),
        "allâtes"],
    [V("aller").t("pc").pe(3).n("s"),
        "est allé"],
    [VP(V("aller").t("f").pe(1).n("p")).typ({neg:true}),
        "n'irons pas"],
    [VP(V("aller").t("pq").pe(2).n("s")).typ({neg:true}),
        "n'étais pas allé"],
    [S(NP(D("le"),N("chat").g("f").n("p")),
      VP(V("manger"),
         NP(D("le"),N("souris")))),
        "Les chattes mangent la souris. "],
    [S(NP(D("le"),N("chat").g("f").n("p")),
      VP(V("manger"),
         NP(D("le"),N("souris")))).typ({pas:true}),
        "La souris est mangée par les chattes. "],
    [S(NP(D('le'),A("blanc"),
         N('chat').g("f").n("p").tag("b").tag("i")),
      VP(V('dévorer').t('pc'),
         NP(D('le'),
            N('souris'),
            A("gris"),"Wow!").tag("a",{href:"http://wikipedia.org/cat",target:"_blank"}))
        ).typ({neg:true}),
        'Les <i><b>chattes</b></i> blanches n\'ont pas dévoré <a href="http://wikipedia.org/cat" target="_blank">la souris grise Wow!</a>'],
    [S(NP(D('le'),
            N('souris').n("p")),
      VP(V('être'),
            AP(A('gris')))).typ({neg:true}),
        "Les souris ne sont pas grises. "],
    [S(Pro("je").n("p").pe(2),
      VP(V("avoir").t("cp"),
         NP(NO(2),A("beau"),N("ami").g("f")))).typ({neg:"plus"}),
        "Vous n'auriez plus eu 2 belles amies. "],
    [S(NP(N("John")),
      VP(V("évanouir").aux("êt").t("pc")),
        PP(P("à"),DT("1979-05-21T10:05:00"))).typ({neg:true}),
        "John ne s'est pas évanoui au lundi 21 mai 1979 à 10 h 5 min 0 s. "],
    [S(CP(C("et"),NP(N("John")),NP(N("Mary"))),
      VP(V("évanouir").t("pc")),
         PP(P("à"),DT("1979-05-21T10:05:00"))).typ({neg:true}),
        "John et Mary ne se sont pas évanouis au lundi 21 mai 1979 à 10 h 5 min 0 s. "],
    [S(VP().add(V("aimer")).add(pomme)).add(gars,0),
        "Les garçons aiment la pomme. "],
    [S(CP(C("et"),NP(D("le"),N("fruit"))).add(pomme).add(gars),
              VP(V("venir").t("pc"),
                 Adv("hier"))),
        "Le fruit, la pomme et les garçons sont venus hier. "],
    [S(CP(C("et"),NP(D("le"),N("orange"))).add(pomme),
                  VP(V("arriver").t("pc"),
                     Adv("hier"))),
        "L'orange et la pomme sont arrivées hier. "],
    [S(Pro("je"),
              VP(V("manger").t("pc"),
                 NP(D("le"),N("pomme")))),
        "Il a mangé la pomme. "],
    [S(Pro("je"),
              VP(V("manger").t("pc"),
                 NP(D("le"),N("pomme")).tag("i").pro())),
        "Il <i>l'</i> a mangée. "],
    [S(NP(D("le"),N("pomme").tag("i"),
       SP(Pro("qui"),
          VP(V("manger").aux("êt").t("pc"))))),
        "La <i>pomme</i> qui est mangée. "],
    [NP(D("le"),N("pomme").tag("i"),
                 SP(Pro("que"),
                    Pro("je"),
                    VP(V("manger").t("pc")))),
        "la <i>pomme</i> qu'il a mangée"],
    [S(NP(D("le"),N("pomme").tag("i"),
                     SP(Pro("que"),
                        Pro("je"),
                        VP(V("manger").t("pc")))).pro()),
        "Elle. ",
    "Conversion d'un '.pro' au premier niveau, n'est pas traitée"],
    [S(NP(D("le"),N("enfant").n("p")),VP(V("manger"),NP(D("le"),N("gâteau")))).typ({pas:true}),
        "Le gâteau est mangé par les enfants. "],
    [S(Pro("je").pe(1).n("p"), VP(V("agir").t("pc"), AdvP(Adv("conformément"),
                      PP(P("à"), NP(D("le"), N("loi")))))).typ({neg:true}),
        "Nous n'avons pas agi conformément à la loi. "],
    [S(NP(D('le'),
         N('souris'),
         SP(Pro('que'),
             NP(D('le'),
                 N('chat').n("p")),
             VP(V('manger').t('pc')))),
      VP(V('être'),
         AP(A('gris')))),
        "La souris que les chats ont mangée est grise. "],
    [DT(),
        null],
    [DT(new Date()).nat(false),
        null],
    [DT(new Date()).dOpt({rtime:true}),
        null],
    [NO(1.847584).dOpt({mprecision: 0}),
        "2"],
    [NO(1.847584).dOpt({mprecision: 4}),
        "1,8476"],
    [NO(1.847584).dOpt({raw:false}),
        "1,85"],
    [NO(1.847584).dOpt({raw:true}),
        "1.847584"],
    [NO(125).dOpt({nat:true}),
        "cent vingt-cinq"],
    [NO(10).dOpt({ord:true}),
        "dixième"],
    [NP(NO(0), N("avion")),
        "0 avion"],
    [NP(NO(2), N("avion")),
         "2 avions"],
    [NP(NO(1.5), N("livre")),
        "1,5 livre"],
    [NP(NO(2.4), N("livre")),
        "2,4 livres"],
    [NP(NO(2), A("rouge"),N("avion")),
        "2 avions rouges"],
    [N("pomme").g("w"),
        "pomme"],
    [S(Pro("lui").c("nom"),
      VP(V("donner").t("pc"),
         NP(D("un"),N("pomme")).pro(),
         PP(P("à"),NP(D("le"),A("jeune"),N("femme"))
         ))),
         "Il l'a donnée à la jeune femme. "],
    [S(Pro("lui").c("nom"),
      VP(V("donner").t("pc"),
         NP(D("un"),N("pomme")).pro(),
         PP(P("à"),NP(D("le"),A("jeune"),N("femme"))).pro())),
         "Il la lui a donnée. "],
    [S(Pro("je").pe(1),
      VP(V("mettre").t("pc"),
         NP(D("le"),N("lettre")),
         PP(P("sur"),NP(D("le"),N("table"))).pro())),
         "J'y ai mis la lettre. "],
    [S(Pro("je").pe(1),
      VP(V("mettre").t("pc"),
         NP(D("le"),N("lettre")).pro(),
         PP(P("sur"),NP(D("le"),N("table"))).pro())).typ({neg:true}),
         "Je ne l'y ai pas mise. "],
    // exemples du papier "Architecture..."
    // Figure 6
    [S(Pro("lui").c("nom"),
       VP(V("donner").t("pc"),
          NP(D("un"),N("pomme")).pro())),
     "Il l'a donnée. "],
    // Table 1 - 1
    [S(Pro("lui").c("nom"),
       VP(V("donner").t("pc"),
          NP(D("un"),N("pomme")).pro())).typ({neg:true}),
     "Il ne l'a pas donnée. "],
    // Table 1 - 2
    [S(Pro("lui").c("nom"),
       VP(V("donner").t("pc"),
          NP(D("un"),N("pomme")).pro(),
          PP(P("à"),NP(D("le"),N("fille"))))).typ({neg:true}),
     "Il ne l'a pas donnée à la fille. "],
    // Table 1 - 3
    [S(Pro("lui").c("nom"),
       VP(V("donner").t("pc"),
          NP(D("un"),N("pomme")).pro(),
          PP(P("à"),NP(D("le"),N("fille"))).pro())).typ({neg:true}),
     "Il ne la lui a pas donnée. "],
    // Table 1 - 4
    [S(Pro("lui").c("nom"),
       VP(V("donner").t("pc"),
          NP(D("un"),N("pomme")).pro(),
          PP(P("à"),NP(D("le"),N("fille"))).pro())).typ({neg:true,pas:true}),
     "Elle ne lui a pas été donnée par lui. "],
    // position des pronoms devant le verbe
    [S(Pro('lui').c("nom"),
       VP(V('donner').t("pc"),
          NP(D('un'),N('chat')).pro(),
          Pro("elle").c("dat"))),
     "Il le lui a donné. "],
    // modifications globales de propriétés
    [S(NP(D("le"),N("chat").g("f")),
      VP(V("manger"),
         NP(D("le"),N("souris")))).t("f"),
        "La chatte mangera la souris. "],
    [S(CP(C("et"),
          Pro("elle").tn(""),
          Pro("moi").tn("")),
        VP(V("aller"),
           PP(P("à"),
              NP(D("le"),N("plage"))))).t("pc"),
     "Elle et moi sommes allés à la plage. "],
    // changement de personne dans le déterminant
    [S(NP(D("notre").pe(2),N("chef")),
       VP(V("aller"))),
     "Votre chef va. "],
    // nouveau type de question "yon" par inversion du sujet
    [S(NP(D('le'),  // 54
          N('chat')),
       VP(V('manger'),
          NP(D('le'),
             N('souris')))).typ({int:"yon"}),
     "Le chat mange-t-il la souris? "],
    [S(NP(D('le'), // 55
          N('chat')),
       VP(V('manger'),
          NP(D('le'),
             N('souris')))).typ({int:"yon",neg:true}),
     "Le chat ne mange-t-il pas la souris? "],
    [S(NP(D('le'), // 56
          N('chat')),
       VP(V('manger'),
          NP(D('le'),
             N('souris')))).typ({int:"yon",pas:true}),
     "La souris est-elle mangée par le chat? "],
     [S(Pro("je"),  // 57
        VP(V('manger'),
           NP(D('le'),
              N('fromage')))).typ({int:"yon"}),
     "Mange-t-il le fromage? "],
     [S(Pro("je"),  // 58
        VP(V('manger').t("pc"),
           NP(D('le'),
              N('fromage')))).typ({int:"yon"}),
     "A-t-il mangé le fromage? "],
    // question tag
     [S(Pro("je"),  // 59
        VP(V('manger').t("pc"),
           NP(D('le'),
              N('fromage')))).typ({int:"tag"}),
     "Il a mangé le fromage, n'est-ce pas? "],
];

//  exemples en anglais
loadEn();
let apple = NP(D("a"),N("apple"));
let appleC = apple.clone();
let appleF = ()=>NP(D("a"),N("apple"))

var exemplesEn=[
    [V("love"),"loves"],                             // 0
    [V("have").t("ps"),"had"],                       // 1
    [V("be").pe(3),"is"],                            // 2
    [VP(V("love")).typ({neg:true}),"does not love"], // 3
    [VP(V("love")).typ({int:"yon"}),"does love? "],  // 4
    [VP(V("love")).typ({prog:true}),"is loving"],    // 5
    [VP(V("love")).typ({mod:"poss"}),"can love"],    // 6
    // examples from the "Architecture..." paper
    // Figure 1
    [S(Pro("him").c("nom"),                          // 7
       VP(V("eat"),
          NP(D("a"),N("apple").n("p")).tag("em")
     )),"He eats <em>apples</em>. "],
    //  Figure 1 (with global modification)
    [S(Pro("him").c("nom"),                          // 8
       VP(V("eat"),
          NP(D("a"),N("apple").n("p")).tag("em")
     )).t("ps"),
     "He ate <em>apples</em>. "],
    // Figure 4
    [S(Pro("him").c("nom"),                          // 9
       VP(V("eat"),
          NP(D("a"),N("apple").n("p"))
     )).typ({"neg":true}),"He does not eat apples. "],
    // Figure 5
    [S(Pro("him").c("nom"),                          //10
       VP(V("eat"),
          NP(D("a"),N("apple").n("p"))
     )).typ({"neg":true,"pas":true}),
     "Apples are not eaten by him. "],
    // Section 6.1
    [S(Pro("him").c("nom"), VP(V("eat"),            // 11
       NP(D("a"),N("apple").n("p")).add(A("red"))) 
      ).add(Adv("now").a(","),0),
     "Now, he eats red apples. ",
     "Conversion does not handle 'add' correctly"],
    // Section 6.2
    [S(CP(C("and"),NP(D("the"),N("apple")),         // 12
                   NP(D("the"),N("orange")),
                   NP(D("the"),N("banana"))), 
       VP(V("be"),A("good"))),
     "The apple, the orange and the banana are good. "],
    [S(CP(C("and"),NP(D("the"),N("apple"))),        // 13
       VP(V("be"),A("good"))),
     "The apple is good. "],
     // Section 6.3
     [S(Pro("him").c("nom"),                        // 14
        CP(C("and"),
           VP(V("eat"),apple), VP(V("love"),appleC.pro()))),
      "He eats an apple and loves it. "],
      // this example is not exactly what is in the paper, but I have not managed to make it work properly
     [S(NP(D("a"),N("apple")).pro(),VP(V("be"),A("red"))),// 15 
      "It is red. "],
     [S(Pro("him").c("nom"),                       // 16
        CP(C("and"),
           VP(V("eat"),appleF()), 
           VP(V("love"),appleF().pro()))),
      "He eats an apple and loves it. "],
     [S(appleF() ,VP(V("be"),A("red"))),             // 17
      "An apple is red. "],
     [S(Pro("him").c("nom"),                       // 18
        CP(C("and"),
           VP(V("eat"),appleF()), 
           VP(V("love"),appleF().clone().pro()))),
      "He eats an apple and loves it. "],
     [S(appleF() ,VP(V("be"),A("red"))),           // 19
      "An apple is red. "],
      // Section 6.4
      [S(Pro("him").c("nom"),                      // 20
         VP(V("eat"),
            NP(D("a"), N("apple").tag("a", {href:"https://en.wikipedia.org/wiki/Apple"})))),
       'He eats an <a href="https://en.wikipedia.org/wiki/Apple">apple</a>. '],
      // Section 6.6
      [NP(NO(1).dOpt({nat:true}),N("plane")),     // 21
       "one plane"],   
      [NP(NO(3).dOpt({nat:true}),N("plane")),     // 22
       "three planes"],
      [S(AP(D("the"),                            // 23 
            A("large").f("su"),
            PP(P("of"),
               NP(D("the"),
                  N("trainer").n("p"))).a(",")),
         NP(D("this").n("s"),    // check propagation of the number (this should not be these)
            N("addition").n("s"))),
       "The largest of the trainers, this addition. ",
       "Peculiar structure of constituents for which the dependents are not strickly equivalent "],
       // question tag
      [S(Pro("him").c("nom"),                          // 24
         VP(V("eat"),
            NP(D("a"),N("apple").n("p")).tag("em")
       )).typ({int:"tag"}),
       "He eats <em>apples</em>, doesn't he? "],
      [S(Pro("him").c("nom"),                          // 25
         VP(V("eat"),
            NP(D("a"),N("apple").n("p")).tag("em")
       )).typ({neg:true,int:"tag"}),
       "He does not eat <em>apples</em>, does he? "],
      [S(Pro("him").c("nom"),                          // 26
         VP(V("eat").t("f"),
            NP(D("a"),N("apple").n("p")).tag("em")
       )).typ({int:"tag"}),
       "He will eat <em>apples</em>, won't he? "],
];

// dépendances en français
loadFr();
addToLexicon("Mauritanie",{"N":{"g":"f","tab":["n16"]}})
addToLexicon("Algérie",{"N":{"g":"f","tab":["n16"]}})
addToLexicon("Maroc",{"N":{"g":"m","tab":["n1"]}})

var dependancesFr=[
    [root(V("pleuvoir"),
          subj(Pro("lui").c("nom")),
          mod(P("dans"),
              comp(N("maison"),
                     det(D("mon").pe(1))))),"Il pleut dans ma maison. "],       // 0
    [root(V("bâtir").t("ps"),
          subj(Pro("moi").c("nom")),
          comp(N("cabane").n("p"),
               det(D("un")),
               mod(A("petit")),
               mod(A("rouge"))),
          mod(P("en"),
              mod(Q("1998")))),"Je bâtis des petites cabanes rouges en 1998. "], // 1
    [root(V("manger"),
          subj(Pro("vous").c("nom")),
          coord(C("et"),
                comp(N("pomme"),
                     det(D("un"))),
                comp(N("orange"),
                     det(D("un"))).n("p"))),
     "Vous mangez une pomme et des oranges. "],                                // 2
    [root(V("être"),
          subj(Pro("ce")),
          mod(Adv("alors")),
          comp(Q("Alba"),
               coord(C("et"),
                     mod(V("reprendre"),
                         subj(Pro("qui")),
                         comp(N("contrôle"),
                                 det(D("le")),
                                 comp(P("de"),
                                         comp(N("situation"),
                                                 det(D("le")))))),
                     mod(V("réprimer"),
                         subj(Pro("qui")),
                         comp(N("révolte"),
                                 det(D("un")),
                                 comp(P("de"),
                                         comp(N("peuple"),
                                                 det(D("le")))),
                                 comp(P("devant"),
                                         comp(N("cour"),
                                                 det(D("le")),
                                                 mod(A("royal"))))))))),
    "C'est alors Alba qui reprend le contrôle de la situation et qui réprime une révolte du peuple devant la cour royale. "],// 3
    [root(V("courir"),
          coord(C("et"),
                subj(N("chat"),
                     det(D("le"))),
                subj(N("chien"),
                     det(D("le"))))),
    "Le chat et le chien courent. "],                                 // 4
    [root(V("avoir"),
          subj(Pro("lui").c("nom")),
          comp(N("peur"),
                  comp(P("de"),
                          comp(N("araignée"),
                                  det(D("le")))))),
     "Il a peur de l'araignée. "],                                    // 5
    [root(V("être"),
          mod(C("mais")).pos("pre"),
          subj(N("réalité"),
               det(D("le"))),
          comp(C("que"),
                  comp(V("être"),
                          subj(N("Mauritanie"),
                               det(D("le"))),
                          coord(C("ou"),
                                comp(N("Maroc"),
                                        det(D("le"))),
                                comp(N("Algérie"),
                                        det(D("le"))))).typ({neg:true}))),
     "Mais la réalité est que la Mauritanie n'est pas le Maroc ou l'Algérie. "], //6
    [root(V("manger"),
          subj(N("garçon"),
               det(D("le"))).n("p").pro(),
          coord(C("et"),
                comp(N("pomme"),
                     det(D("un"))),
                comp(N("orange"),
                     det(D("un"))).n("p"))),
     "Ils mangent une pomme et des oranges. "],                             // 7
    [root(V("pleuvoir"),
          subj(Pro("lui").c("nom")),
          mod(P("dans"),
              comp(N("maison"),
                     det(D("mon").pe(1)))).pro()),"Il y pleut. "],       // 8
    [root(V("bâtir").t("ps"),
          subj(Pro("moi").c("nom")),
          comp(N("cabane").n("p"),
               det(D("un")),
               mod(A("petit")),
               mod(A("rouge"))).pro(),
          mod(P("en"),
              mod(Q("1998")))),"Je les bâtis en 1998. "],                // 9
    [root(V("manger"),
          subj(N("souris"),
               det(D("le"))),
          comp(N("fromage"),
               det(D("le")))).typ({"pas":true}),
     "Le fromage est mangé par la souris. "],                          // 10
    [root(V("bâtir").t("ps"),
          comp(Pro("lui").c("acc")),
          mod(P("en"),
              mod(Q(1998)))).typ({"pas":true}),
     "Il fut bâti en 1998. "],                          // 11
    [root(V("vendre"),
          subj(N("livre"),
               det(D("le"))),
          mod(Adv("bien"))).typ({"refl":true}),
     "Le livre se vend bien. "],                          // 12
    [root(V("donner").t("pc"),
          subj(Pro("lui").c("nom")), 
          comp(N("pomme"),
                  det(D("un"))).pro()
         ).typ({"neg":true,"pas":true}),
     "Elle n'a pas été donnée par lui. "],                          // 13
    [root(V("donner").t("p"),
          subj(Pro("lui").c("nom")),
          coord(C("et"), 
                comp(N("pomme"),det(D("un"))),
                comp(N("poire"),det(D("un"))).n("p"))
         ).typ({"neg":true,"pas":true}),
     "Une pomme et des poires ne sont pas données par lui. "],        // 14
    
]


// English dependences
loadEn();
addToLexicon("practice",{"V":{"tab":"v3"}}) // should be in the original lexicon
var dependenciesEn=[
    [root(V("walk"),
              subj(N("man"),
                   det(D("a")))),"A man walks. "],                             // 0
    [root(V("be"),
          subj(V("practice").t("pr"),
                   comp(N("joke"),
                            det(D("my").pe(2).ow("s")))),
                    mod(A("crucial"))),"Practicing your joke is crucial. "],    // 1
    [root(V("eat"),
          subj(Pro("him").c("nom")),
          comp(N("apple"),
               det(D("a"))).n("p").tag("em")).t("ps"),"He ate <em>apples</em>. "],// 2
    [root(V("come").t("pr"),
          comp(P("into"),
                  comp(N("area"),
                         det(D("the")))),
          comp(P("to"),
                 comp(V("see").t("b"),
                         comp(N("concert"),
                                 det(D("a"))).n("p")))),
    "Coming into the area to see concerts. "],                                    // 3
    [root(V("be").t("ps"),
          subj(Pro("it")),
          comp(P("from"),
                  mod(Q("John"))),
          comp(C("that"),
                  comp(V("hear").t("ps"),
                         subj(Pro("me").c("nom").g("f")),
                         comp(N("news"),
                                 det(D("the")))))),
     "It was from John that she heard the news. "],                                //4
    [root(V("be"),
           subj(N("man"),
                det(D("every")),
                mod(V("be"),
                    subj(Pro("that")),
                      mod(V("miss").t("pr")))),
          comp(V("punish").t("pp")),
          comp(P("for"),
            mod(Pro("you")))),
    "Every man that is missing is punished for you. "],                              //5
    [root(V("stop").t("ps"),
          mod(Adv("nearly")).pos("pre"),
          subj(Pro("it")),
          comp(V("rain").t("pr"))).typ({"perf":true}),
     "Nearly it had stopped raining. "],                                            //6 (differeent word order)
    [root(V("waste").t("ps"),
          mod(C("if"),
              comp(V("have").t("ps"),
                      subj(Pro("I")).pe(1),
                       comp(N("chance"),
                               det(D("a")),
                               mod(A("similar"))))).a(",").pos("pre"),
          subj(Pro("I").pe(1)),
          comp(Pro("it"))).typ({"mod":"will","neg":true}),
     "If I had a similar chance, I would not waste it. "],                        //7
    [root(V("walk"),
              subj(N("man"),
                   det(D("a"))).pro()),"He walks. "],                             // 8
    [root(V("be"),
          subj(V("practice").t("pr"),
                   comp(N("joke"),
                            det(D("my").pe(2).ow("s"))).pro()),
                    mod(A("crucial"))),"Practicing it is crucial. "],    // 9
    [root(V("eat"),
          subj(Pro("him").c("nom")),
          comp(N("apple"),
               det(D("a"))).n("p").pro().tag("em")).t("ps"),"He ate <em>them</em>. "],// 10
    [root(V("applaud").t("f"),
          comp(Pro("this"))).typ({"mod":"nece","pas":true}),"This shall be applauded. "],// 11
    [root(V("remember"),
          subj(Pro("you"))).typ({"int":"yon"}),"Do you remember? "], // 12
    [root(V('eat'),                                                 // 13
          comp(N('apple').n("p"),det(D('a'))).tag("em"),
          subj(N("man"),det(D("the")))).typ({"neg":false,"int":"tag"}),
     "The man eats <em>apples</em>, doesn't he? "],
];

// bilingual example
loadFr();
var dest=NP(D("le"),N("monde"));
loadEn();
const constituentEnFr=
    S(Pro("I").pe(1),
    VP(V("say"),
        "hello",
        PP(P("to"),dest.tag("b"))));


function showEx(exemple){
    console.log(exemple[0]+"")
}

function testAllEx(fn,exemples){
    for (var i = 0; i < exemples.length; i++) {
        fn(exemples[i])
    }
}

// test a single expression (useful for launching the debugger on a given expression
// proper language must be chosen before calling... because the parameter is evaluated before the function call
function test(exp){
    console.log(exp.toSource(0))
    console.log(exp.realize())
    console.log("---")
}

function showDiffs(nomEx,nbDiffs,nbTests){
    if (getLanguage()=="en"){
        if (nbDiffs==0)
            console.log("%s :: *** no differences over %d tests",nomEx,nbTests);
        else
            console.log("%s :: *** %d difference%s over %d tests",nomEx,nbDiffs,nbDiffs==1?"":"s",nbTests) 
    } else {
        if (nbDiffs==0)
            console.log("%s :: *** aucune différence sur %d tests",nomEx,nbTests);
        else
            console.log("%s :: *** %d différence%s sur %d tests",nomEx,nbDiffs,nbDiffs==1?"":"s",nbTests) 
    }
}

function checkAllEx(nomEx,exemples){
    const nb=exemples.length;
    let nbDiffs=0;
    for (var i=0;i<nb;i++){
        const exp=exemples[i][0].clone();
        // console.log(exp.toSource());
        const gen=exp.toString();
        const expected=exemples[i][1];
        if (expected!==null && gen!=expected){
            console.log("%d:%s\n => %s\n ** %s",i,exp.toSource(),gen,expected)
            nbDiffs++;
        }
    }
    showDiffs(nomEx,nbDiffs,exemples.length);
}

function checkAllExDep(nomEx,exemples){
    const lang=getLanguage()
    const nb=exemples.length;
    let nbDiffs=0,nbTests=0;
    for (var i=0;i<nb;i++){
        if (exemples[i][2]!==undefined){
            console.log(lang=="en"?"**:skip example %d: %s":"**:saute exemple %d:%s",i,exemples[i][2])
        } else {
            const exp=exemples[i][0].clone();
            const dep=exp.toDependent();
            // show(dep);
            const gen=dep.toString();
            const expected=exemples[i][1];
            if (expected!==null && gen!=expected){
                console.log("%d:%s\n %s\n => %s\n ** %s",i,exp.toSource(),dep.toSource(),gen,expected)
                nbDiffs++;
            }
            nbTests++;
        }
    }
    showDiffs(nomEx,nbDiffs,nbTests);
}

function checkAllExJSON(nomEx,exemples){
    const nb=exemples.length;
    let nbDiffs=0;
    for (var i=0;i<nb;i++){
        const expJS=exemples[i][0].toJSON();
        const genJS=fromJSON(expJS).toString();
        const expected=exemples[i][1];
        if (expected!==null && genJS!=expected){
            console.log("%d:%s\n => %s\n ** %s",i,ppJSON(expJS),genJS,expected)
            nbDiffs++;
        }
    }
    showDiffs(nomEx+"-JSON",nbDiffs,exemples.length);
}

loadFr();
checkAllEx("exemplesFr",exemplesFr);
checkAllExDep("exempleFrDep",exemplesFr);
checkAllExJSON("exemplesFr",exemplesFr);
checkAllEx("dependancesFr",dependancesFr);
console.log("----")
loadEn();
checkAllEx("exemplesEn",exemplesEn);
checkAllExDep("exempleEnDep",exemplesEn);
checkAllExJSON("exemplesEn",exemplesEn);
checkAllEx("dependenciesEn",dependenciesEn)

// testWarnings()
loadEn()
addToLexicon({"John":{"N":{"g":"m","tab":"n4"}}})
addToLexicon({"Mary":{"N":{"g":"f","tab":"n4"}}})
Constituent.debug=true;
const s=S(NP(D("the"),N("cat")).n("p"),
          VP(V("sit").t("ps"),
             PP(P("on"),
                NP(D("the"),N("mat"))))).typ({int:"tag",neg:true})
test(s)
test(coord(C("but"),root(V("laugh").t('ps'),subj(N("John"))),
                    root(V("smack").t('ps'),subj(N("Mary")),
                         coord(C("and"),comp(N("butler"),det(D("the"))),
                               comp(N("maid"),det(D("the")))))))

test(constituentEnFr);

loadFr();
test(root(V('travailler').t("pc"),
          comp(Adv('bien')),
          subj(Pro('je').pe(2))).typ({"mod":"nece"}))