import { Service } from '../types';

export const SERVICES: Service[] = [
  {
    id: 'pece-o-jizvu',
    name: 'Holistická péče o jizvu',
    shortDescription: 'Unikátní péče pro fyzické i psychické zahojení jizev (po císařském řezu, gynekologických operacích, nástřihu či úrazech).',
    longDescription: 'Jizva je víc než jen značka na těle. Je to místo, kde se setkává fyzická rovina s naší emocionální pamětí. Tato péče kombinuje šetrné manuální techniky, jemnou masáž, zahřívání, uvolnění fascií a přecitlivělosti s hlubokou integrací prožitku, kterým jizva vznikla. Pomáhám obnovit citlivost, hybnost tkání, energetický tok v tělě a podpořit uvolnění traumatických vzpomínek ukotvených ve tkáni. Vhodné jak pro čerstvé jizvy (po zhojení stehů), tak pro jizvy letité.',
    price: 1300,
    duration: 75,
    category: 'scars'
  },
  {
    id: 'masaz-relaxacni',
    name: 'Relaxační masáž (pro ženy i muže)',
    shortDescription: 'Jemná a hluboce pečující masáž celého těla přizpůsobená aktuálním fyzickým i citovým potřebám (vhodná pro ženy i muže).',
    longDescription: 'Ponořte se do atmosféry bezpečí, klidu a vonných olejů. Tato masáž není jen o svalech – je to rituál péče o vaši duši i tělo. Pomocí pomalých, splývavých hmatů, jemného tlaku a aromaterapie uvolníme nahromaděné napětí, stres a únavu. Masáž je přizpůsobena na míru a je otevřena ženám i mužům, kterým pomáhá znovu se spojit s vlastním tělem, procítit své hranice a spočinout v hlubokém, léčivém klidu.',
    price: 1200,
    duration: 60,
    category: 'massage'
  },
  {
    id: 'masaz-regeneracni',
    name: 'Regenerační a uvolňující masáž (pro ženy i muže)',
    shortDescription: 'Cílené uvolnění svalového napětí, regenerace přetížených partií a obnova vitality celého těla pro muže i ženy.',
    longDescription: 'Ideální volba při pocitech ztuhlosti, bolesti zad či šíje nebo po fyzické námaze. Kombinuje klasické regenerační hmaty s jemným protažením a hloubkovým uvolněním svalových fascií. Masáž je přizpůsobena na míru – intenzitu tlaku vždy ladíme podle vašich pocitů tak, aby byla hloubková, ale stále vyživující a příjemná pro nervový systém. Tato péče je plně vhodná a doporučovaná pro ženy i pro muže.',
    price: 1500,
    duration: 90,
    category: 'massage'
  },
  {
    id: 'masaz-rebozem',
    name: 'Masáž rebozem (Tradiční relaxace šátkem)',
    shortDescription: 'Jemná, hluboce relaxační kolébavá masáž celého těla pomocí tradičního mexického šátku Rebozo. Vhodné pro ženy i muže.',
    longDescription: 'Tradiční technika opečování celého těla pocházející od mexických indiánských porodních bab (parteras). Pomocí tkaného šátku Rebozo se provádí jemné pohupování, kolébání, protahování a bezpečné ohraničení celého těla, bez přímého masírování holé kůže. Přináší okamžité uvolnění nervové soustavy, zmírňuje napětí v bedrech, pánvi a šíji, uvolňuje svaly kolem páteře a navrací tělo do jeho přirozené osy. Je to nesmírně vyživující, stabilizující a bezpečná péče. Masáž rebozem je vhodná pro těhotné a ženy po porodu, ale je také hluboce uvolňující a léčivá pro všechny muže i ženy v období stresu, vyčerpání nebo životních přechodů.',
    price: 1300,
    duration: 75,
    category: 'massage'
  },
  {
    id: 'kraniosakralni-terapie',
    name: 'Kraniosakrální biodynamika (pro ženy i muže)',
    shortDescription: 'Jemný dotek pro harmonizaci nervové soustavy, hluboké uvolnění stresu a aktivaci samoléčebných sil těla u mužů i žen.',
    longDescription: 'Nesmírně jemná, neinvazivní dotyková metoda. Klient leží pohodlně v oblečení na lehátku, zatímco terapeut skrze jemné podepření hlavy, páteře a pánve naslouchá rytmům v těle (tzv. primárnímu dýchání). Pomáhá při chronické únavě, bolestech hlavy, migrénách, pooperačních stavech, vyhoření, úzkostech či potížích se spánkem. Podporuje nervovou soustavu v přechodu ze stavu „bojuj nebo uteč“ do stavu hluboké buněčné regenerace a vnitřního klidu. Terapie je vysoce prospěšná pro ženy i pro muže.',
    price: 1400,
    duration: 90,
    category: 'cranio'
  },
  {
    id: 'pece-v-tehotenstvi',
    name: 'Péče v těhotenství a hýčkání nastávajících maminek',
    shortDescription: 'Příjemná, bezpečná a úlevná masáž pro ženy v radostném i náročném období těhotenství.',
    longDescription: 'Těhotenství klade na tělo ženy velké nároky. Tato uvolňující masáž je navržena speciálně pro nastávající maminky (vhodné od ukončeného 12. týdne). Masáž probíhá většinou v pohodlné pozici na boku s podporou polštářů. Soustředíme se na uvolnění přetížených beder, šíje, ramen a unavených nohou. Používáme čisté, za studena lisované rostlinné oleje a jemnou aromaterapii vhodnou pro těhotné tvořící oasu klidu a bezpečí pro ženu i děťátko.',
    price: 1200,
    duration: 75,
    category: 'pregnancy'
  },
  {
    id: 'poporodni-pece',
    name: 'Poporodní péče a zavinování těla',
    shortDescription: 'Podpora, harmonizace a hluboké opečování ženy v období šestinedělí i měsíce po porodu.',
    longDescription: 'Porodem se otevírá obrovský prostor – fyzicky i energeticky. V poporodním období žena potřebuje být nesena, vyživována a opečována, aby mohla s láskou pečovat o své děťátko. Nabízím jemné masáže na stažení a prohřátí bříška, ošetření jizev po porodu, poradenství v oblasti kojení a péče o miminko, a také tradiční rituál zavinování bříška za pomocí šátku (Rebozo), který dodává pocit stability, ucelenosti a bezpečné náruče.',
    price: 1300,
    duration: 75,
    category: 'pregnancy'
  },
  {
    id: 'porodni-asistence',
    name: 'Služby komunitní porodní asistentky',
    shortDescription: 'Individuální doprovod, odborná péče a podpora na vaší cestě k mateřství – v těhotenství, u porodu i v šestinedělí.',
    longDescription: 'Jako licencovaná porodní asistentka nabízím komplexní, bezpečné a respektující vedení. Doprovázím ženy na jejich individuální cestě. Nabízím odborné těhotenské poradny v pohodlí domova, přípravu na porod, konzultace porodních přání, doprovod k porodu do porodnice (podle domluvy a pravidel dané porodnice) a poporodní návštěvy u vás doma. Moje role je chránit prostor, poskytovat oporu a dodávat sebedůvěru ve vaši vnitřní sílu.',
    price: 2000,
    duration: 90, // generic duration for initial consultations
    category: 'birth'
  },
  {
    id: 'priprava-k-porodu',
    name: 'Individuální příprava k porodu',
    shortDescription: 'Osobní nebo párové setkání zaměřené na praktické, fyzické i mentální naladění se na porod a rodičovství.',
    longDescription: 'Zahoďte tabulky a univerzální kurzy. Tato příprava je šitá na míru vám a vašemu partnerovi/partnerce. Probereme fyziologii porodu, úlevové polohy, dýchání, roli doprovodu, partnerskou masáž a Rebozo techniky, základy péče o novorozence a kojení. Zahrnuje i mentální cvičení pro uvolnění strachu a obav, aby se z porodu stala vědomá, posilující zkušenost, na kterou se budete moci těšit.',
    price: 1600,
    duration: 120,
    category: 'birth'
  },
  {
    id: 'rituality-akce',
    name: 'Rituály a ženské kruhy',
    shortDescription: 'Uzavírací, předporodní či přechodové rituály a tematická setkání v bezpečném kruhu žen.',
    longDescription: 'Rituály jsou důležitými milníky, které nám pomáhají vědomě projít velkými životními změnami. Nabízím individuální rituály na míru: Předporodní rituál (požehnání matce, dodání síly), Rituál zavinování (uzavření porodu nebo jiné životní kapitoly) či oslavy ženskosti. Setkání probíhají v sesterství, s respektem, za doprovodu kouře, květin, písní a hlubokého sdílení.',
    price: 2500,
    duration: 150,
    category: 'other'
  }
];
