/**
 * Practice passages for the typing test (/typing), written for this site. English passages use
 * plain keyboard punctuation (straight quotes, no dashes that need special keys); Hindi passages
 * are Unicode Devanagari. Each is 150–350 words (checked by `npm run test:skills`).
 */
export interface TypingPassage {
  id: string;
  lang: "en" | "hi";
  title: string;
  text: string;
}

export const PASSAGES: TypingPassage[] = [
  {
    id: "en-rainwater",
    lang: "en",
    title: "Rainwater harvesting",
    text: `Water is one of the most precious resources available to any society, yet a large share of the rain that falls on our towns and villages simply runs away into drains. Rainwater harvesting is the simple practice of collecting this water and storing it for later use or guiding it back into the ground. In its most basic form, rain falling on a roof is led through pipes into a tank, where it can be filtered and used for washing, gardening or, after proper treatment, even for drinking. In many parts of the country, traditional structures such as step wells, ponds and small check dams served this purpose for centuries. Today, several cities require new buildings above a certain size to include a harvesting system. The benefits are many. Groundwater levels, which have fallen sharply in many districts, can recover when rainwater is allowed to soak into the soil. Flooding of streets during heavy showers is reduced because less water rushes into overloaded drains. Families also save money on water bills and are less dependent on tankers during the dry months. The cost of a household system is modest, and the maintenance needed is mostly cleaning the roof and the filter before the monsoon begins. When every home, school and office collects even a part of the rain it receives, the combined effect on the water security of a region can be remarkable.`,
  },
  {
    id: "en-digital-payments",
    lang: "en",
    title: "Digital payments",
    text: `The way people in India pay for goods and services has changed greatly over the last decade. Not long ago, most small purchases were made in cash, and sending money to a relative in another city meant a visit to a bank branch or a post office. Today, a vegetable seller, an auto driver and a large shop may all accept payment through a mobile phone in a matter of seconds. This change was made possible by a mix of public infrastructure and private innovation. A common payment interface allows different banks and apps to talk to one another, so a customer of one bank can pay a merchant who banks elsewhere without any extra effort. Low cost smartphones and cheap mobile data brought these services within the reach of millions of new users. Digital payments offer clear advantages. They are quick, they leave a record of every transaction, and they reduce the risks of carrying large amounts of cash. For small businesses, a history of digital receipts can also make it easier to obtain loans. At the same time, users must stay alert. Fraudsters often try to trick people into sharing a one time password or scanning a code that takes money instead of sending it. A simple rule protects most users: never share your PIN or password with anyone, and check the details carefully before approving any payment request.`,
  },
  {
    id: "en-solar-energy",
    lang: "en",
    title: "Solar energy",
    text: `The sun delivers more energy to the earth in a single hour than the whole world uses in a year. Capturing even a small part of this energy can reduce our dependence on coal and oil, which pollute the air and add to climate change. Solar panels are made of cells that convert sunlight directly into electricity. When light falls on these cells, it frees tiny charged particles that flow as an electric current. Panels can be placed on rooftops, over canals, on unused land and even on the surface of lakes, where they also reduce the loss of water through evaporation. India receives strong sunshine for most of the year, which makes it well suited for solar power. Large solar parks now supply electricity to the grid, while rooftop systems allow homes, schools and factories to produce their own power and sometimes sell the extra amount back to the electricity company. Solar pumps help farmers water their fields without diesel. The main challenge with solar power is that it is available only during the day and falls on cloudy days. Storage batteries, better grids that move power between regions, and a mix of solar, wind and water based sources help to solve this problem. As the cost of panels and batteries keeps falling, solar energy is likely to play an even larger role in meeting the needs of a growing economy.`,
  },
  {
    id: "en-cleanliness",
    lang: "en",
    title: "Cleanliness as a habit",
    text: `Clean surroundings are closely linked to good health. Many common illnesses, especially those that affect young children, spread through dirty water, open waste and poor sanitation. The national cleanliness campaign launched on 2 October 2014 aimed to make the country free from open defecation and to improve the management of solid waste. Millions of household toilets were built in rural and urban areas, and villages across the country were encouraged to declare themselves free from open defecation. However, building toilets is only the first step. Real change comes when people use them every day, keep them clean, and teach the same habits to their children. The campaign also drew attention to the problem of waste in cities. Separating wet kitchen waste from dry waste such as paper and plastic at home makes it much easier to recycle and to turn food scraps into compost. Many towns now hold cleanliness surveys and rank cities on how well they collect, process and dispose of waste. Schools play an important role by teaching children to wash their hands with soap, to use dustbins, and to avoid littering. Cleanliness cannot be achieved by the government alone. It depends on the daily choices of every citizen, from the shopkeeper who sweeps the pavement outside his shop to the student who carries an empty wrapper home instead of throwing it on the road.`,
  },
  {
    id: "en-vaccines",
    lang: "en",
    title: "How vaccines protect us",
    text: `A vaccine trains the body to recognise and fight a particular germ before a real infection takes place. It usually contains a weakened or inactive form of the germ, or only a harmless part of it. When the vaccine is given, the immune system responds by producing antibodies and special cells that remember the invader. If the person is later exposed to the actual disease, the body can respond quickly and strongly, often stopping the illness before it causes serious harm. Vaccination has been one of the most successful public health measures in history. Smallpox, which once killed millions of people, has been completely wiped out. Polio has been eliminated from India after a long campaign in which health workers visited homes across the country to give drops to every child. Vaccines also protect people who cannot be vaccinated themselves, such as newborn babies or patients with weak immunity. When most people in a community are immune, a germ finds it hard to spread, and this indirect protection is called herd immunity. Like all medicines, vaccines can cause mild side effects such as a sore arm or a slight fever for a day or two, but serious reactions are very rare. Following the immunisation schedule recommended by doctors, and completing every dose on time, is one of the simplest ways to keep children and adults healthy.`,
  },
  {
    id: "en-panchayati-raj",
    lang: "en",
    title: "Local self government",
    text: `Democracy works best when people can take part in decisions that affect their daily lives. In India, the system of local self government in villages is known as Panchayati Raj. It received constitutional status through an amendment that came into force in 1993, which made it compulsory for states to set up elected bodies at the village, block and district levels. Elections to these bodies are held every five years, and a part of the seats is reserved for women, as well as for Scheduled Castes and Scheduled Tribes. The Gram Sabha, which includes all adult voters of a village, is the foundation of the system. It can discuss the village budget, choose the people who will benefit from welfare schemes, and question elected members about the work done. Panchayats look after matters such as drinking water, village roads, street lights, sanitation and the upkeep of public places. They also help in carrying out many government programmes at the local level. A similar system for towns and cities was created through another amendment, which set up municipal bodies. The success of local government depends on adequate funds, trained staff and the active participation of citizens. When villagers attend meetings, ask questions and keep an eye on public works, local government becomes more honest and more effective.`,
  },
  {
    id: "en-monsoon",
    lang: "en",
    title: "The Indian monsoon",
    text: `For a large part of India, the year is divided not so much by the calendar as by the arrival of the monsoon. During the summer months, the land heats up much faster than the surrounding sea. This creates an area of low pressure over the land, and moist winds from the ocean begin to blow towards it. When these winds meet the mountains, they rise, cool and release their moisture as rain. The south west monsoon usually reaches the coast of Kerala around the beginning of June and spreads across the country over the next few weeks. The Western Ghats and the north eastern hills receive very heavy rain, while areas lying behind the mountains get much less. The monsoon matters greatly to the economy. A large share of farmland in the country still depends on rain rather than on canals or wells, so a good monsoon means better crops, higher rural incomes and lower food prices. Reservoirs fill up, providing water for drinking and electricity for the rest of the year. On the other hand, a weak or delayed monsoon can cause drought, while very heavy rain in a short period can lead to floods and landslides. Weather scientists study ocean temperatures and wind patterns to forecast the monsoon, and these forecasts help farmers and governments plan ahead.`,
  },
  {
    id: "en-libraries",
    lang: "en",
    title: "Public libraries",
    text: `A public library is one of the few places where anyone, rich or poor, young or old, can walk in and learn something new without paying a fee. For students preparing for competitive examinations, a quiet reading room with good light and a table can make a real difference, especially for those who share a small home with a large family. Many libraries also keep newspapers, magazines and reference books that would be too costly for a single reader to buy. In recent years, libraries have begun to change with the times. Some now offer computers with internet access, digital collections that members can read on their phones, and short courses on using online services. Village libraries and mobile book vans carry reading material to places where bookshops are rare. Libraries also bring communities together through reading clubs, story sessions for children and talks by local writers. Despite these benefits, many libraries struggle with old buildings, too few staff and limited budgets. Supporting them does not always require large sums of money. Donating books in good condition, volunteering time, or simply using the library regularly can help keep it alive. A society that values its libraries is investing in the knowledge and imagination of its future citizens.`,
  },
  {
    id: "en-wetlands",
    lang: "en",
    title: "Why wetlands matter",
    text: `Wetlands are areas where water covers the soil for all or part of the year. They include marshes, swamps, lakes with shallow edges, river floodplains and mangrove forests along the coast. For a long time, such land was often seen as wasteland, to be drained and filled for farming or construction. Today, scientists recognise wetlands as some of the most valuable ecosystems on earth. They act like natural sponges, soaking up excess water during heavy rain and releasing it slowly, which reduces floods downstream. Plants and tiny organisms in wetlands trap mud and break down many pollutants, so the water that flows out is cleaner than the water that flowed in. Mangroves protect coastal villages from storms and high waves, and their roots provide shelter for young fish. Wetlands are also home to a great variety of birds, many of which travel thousands of kilometres every winter to reach them. India has a number of wetlands recognised as being of international importance under a global agreement signed in 1971 in the Iranian city of Ramsar. Protecting wetlands means stopping the dumping of waste, controlling encroachment, and involving local communities who depend on them for fish, fodder and water. Healthy wetlands are a sign of a healthy environment.`,
  },
  {
    id: "en-railways-history",
    lang: "en",
    title: "Railways in India",
    text: `The first passenger train in India ran in April 1853 between Bombay and Thane, covering a distance of about thirty four kilometres. From that modest beginning, the railways grew into one of the largest networks in the world. During the colonial period, the lines were built mainly to carry raw materials to the ports and to move troops, but they also brought distant regions closer together and changed the way people travelled, traded and thought about the country as a whole. After independence, the many separate railway companies were joined into a single national system and divided into zones for easier management. Over the decades, steam engines gave way to diesel and then to electric locomotives, and a large part of the network has now been electrified. The railways carry millions of passengers every day, from daily commuters in crowded suburban trains to families making long journeys across the country. They also move huge quantities of coal, food grain, cement and other goods. In recent years, new dedicated freight corridors, faster trains and the modernisation of stations have been taken up. The railways are also one of the largest employers in the country, which is why their recruitment examinations attract so many applicants every year.`,
  },
  {
    id: "en-reading-habit",
    lang: "en",
    title: "The habit of reading",
    text: `In an age of short videos and endless notifications, the ability to sit with a book for an hour has become rare and valuable. Reading regularly improves vocabulary, strengthens concentration and helps us understand ideas that cannot be explained in a few seconds. For an examination candidate, the benefits are very practical. Comprehension passages become easier, the speed of reading questions improves, and a wider knowledge of the world helps in general awareness and essay writing. Building a reading habit does not require reading for many hours at once. Fifteen or twenty minutes every day, at a fixed time, is enough to begin with. It helps to start with topics that genuinely interest you, whether that is sport, science, history or fiction, rather than forcing yourself through a book you find dull. Keeping a small notebook to write down new words and interesting facts makes the reading more active and easier to remember. Newspapers are particularly useful because they combine current events with good examples of formal writing. Reading aloud now and then also improves pronunciation and confidence. Over months, these small daily efforts add up, and the reader often finds that understanding difficult material has become much easier than before.`,
  },
  {
    id: "en-space-research",
    lang: "en",
    title: "Space research",
    text: `India's space programme began in the early 1960s with a small team of scientists who launched sounding rockets from a fishing village near Thiruvananthapuram. The early rockets were so light that parts were sometimes carried to the launch site on bicycles. From these humble beginnings, the programme has grown into one that designs, builds and launches its own satellites and rockets. The first Indian satellite, Aryabhata, was launched in 1975 with help from another country. Since then, Indian rockets have placed a large number of satellites into orbit for the country and for foreign customers. Satellites play a part in many everyday activities. They help forecast the weather and track cyclones, so that people can be moved to safety in time. They link television and telephone networks, support navigation, and help map crops, forests and water resources. Missions to the Moon and to Mars have shown that useful scientific work can be done at a relatively low cost. The space programme has also inspired many students to take up careers in science and engineering. Its main lesson is that careful planning, patient effort and learning from failures can turn a small start into remarkable achievement.`,
  },
  {
    id: "en-road-safety",
    lang: "en",
    title: "Road safety",
    text: `Every year, a very large number of people lose their lives in road accidents in India, and many more are seriously injured. Most of these accidents are not caused by bad luck but by avoidable mistakes such as speeding, driving on the wrong side, jumping signals, using a mobile phone while driving and driving after drinking alcohol. Simple habits can save lives. Riders of two wheelers and their passengers should always wear a good quality helmet with the strap fastened. Everyone in a car should wear a seat belt, including those sitting at the back. Children should travel in seats suited to their age. Pedestrians should cross at zebra crossings or subways, and should be extra careful at night when they are harder to see. Drivers must remember that a vehicle moving at high speed needs a much longer distance to stop. Good roads, clear signs, speed cameras and strict enforcement of traffic laws all help, but the attitude of road users matters most. Helping accident victims quickly is equally important, because the first hour after an injury is often decisive. The law protects people who help victims in good faith from harassment. A culture of patience and respect on the road would make our journeys safer for everyone.`,
  },
  {
    id: "en-millets",
    lang: "en",
    title: "Millets",
    text: `Millets are small grained cereals such as jowar, bajra, ragi and several lesser known varieties that have been grown in India for thousands of years. For a long time, they were treated as the food of the poor and were slowly replaced by rice and wheat on many plates. In recent years, however, interest in millets has returned, and the United Nations declared 2023 the International Year of Millets following a proposal from India. There are good reasons for this renewed attention. Millets are rich in fibre, minerals such as iron and calcium, and other nutrients. They release energy slowly, which makes them a good choice for people who need to control their blood sugar. From a farming point of view, millets are hardy crops. Most of them need much less water than rice, can grow on poor soil, and tolerate high temperatures, which makes them valuable in dry regions and in a changing climate. Bringing millets back into daily use requires effort at several levels. Farmers need fair prices and good seeds, processing units must make the grains easier to cook, and consumers can try simple dishes such as rotis, porridge and snacks made from millet flour. Small changes in diet can benefit both personal health and the environment.`,
  },
  {
    id: "en-constitution",
    lang: "en",
    title: "The making of the Constitution",
    text: `The Constitution of India was prepared by a Constituent Assembly whose members were drawn from the provinces and princely states. The assembly met for the first time in December 1946 and worked for nearly three years. A drafting committee, chaired by Dr B R Ambedkar, prepared the text, which was then debated clause by clause. Members discussed questions such as the powers of the centre and the states, the rights of citizens, the role of the President and the protection of minorities. The debates were long and often passionate, but they were conducted with great respect for differing views. The Constitution was adopted on 26 November 1949, a day now observed as Constitution Day, and it came into force on 26 January 1950, which is celebrated as Republic Day. The framers borrowed ideas from several other constitutions but shaped them to suit Indian conditions. The document declares India a sovereign democratic republic, guarantees fundamental rights to citizens, and sets out directive principles to guide the government. It also provides a method for its own amendment, so that it can respond to changing needs while keeping its basic structure intact. For a student, reading even a few pages of the debates gives a valuable picture of the vision behind the republic.`,
  },

  // ---------------- Hindi ----------------
  {
    id: "hi-jal-sanrakshan",
    lang: "hi",
    title: "जल संरक्षण",
    text: `जल ही जीवन है, यह बात हम बचपन से सुनते आए हैं, लेकिन इसका महत्व हमें तब समझ आता है जब नल में पानी आना बंद हो जाता है। हमारे देश के कई हिस्सों में भूजल का स्तर लगातार नीचे जा रहा है और गर्मियों में अनेक गाँवों और शहरों को टैंकरों पर निर्भर रहना पड़ता है। इस समस्या का समाधान केवल सरकार के प्रयासों से संभव नहीं है, बल्कि हर नागरिक को अपनी आदतों में बदलाव लाना होगा। घर में टपकते नलों की मरम्मत करना, दाँत साफ करते समय नल बंद रखना और कपड़े धोने के बाद बचे पानी से पौधों को सींचना जैसे छोटे कदम बड़ा अंतर ला सकते हैं। वर्षा जल संचयन एक सरल और प्रभावी उपाय है, जिसमें छत पर गिरने वाले बारिश के पानी को टंकी में इकट्ठा किया जाता है या जमीन के अंदर पहुँचाया जाता है। पुराने समय में तालाब, बावड़ी और कुएँ इसी काम आते थे और गाँव के लोग मिलकर उनकी देखभाल करते थे। किसानों के लिए टपक सिंचाई और फव्वारा सिंचाई जैसी तकनीकें कम पानी में अधिक उपज देने में मदद करती हैं। यदि हम आज पानी बचाने का संकल्प लें, तो आने वाली पीढ़ियों को पानी की कमी का सामना नहीं करना पड़ेगा।`,
  },
  {
    id: "hi-swasthya",
    lang: "hi",
    title: "अच्छा स्वास्थ्य",
    text: `अच्छा स्वास्थ्य सबसे बड़ा धन माना जाता है, क्योंकि स्वस्थ शरीर और शांत मन के बिना कोई भी लक्ष्य पाना कठिन होता है। प्रतियोगी परीक्षाओं की तैयारी करने वाले विद्यार्थी अक्सर पढ़ाई के दबाव में अपने खान पान और नींद की अनदेखी कर देते हैं, जिसका असर धीरे धीरे उनकी एकाग्रता पर पड़ता है। संतुलित आहार में अनाज, दालें, हरी सब्जियाँ, फल और दूध जैसी चीजें शामिल होनी चाहिए। बाहर के तले भुने खाने और अधिक मीठे पेय पदार्थों से जितना हो सके बचना चाहिए। रोज कम से कम आधा घंटा व्यायाम, योग या तेज चाल से टहलना शरीर को चुस्त रखता है और तनाव को भी कम करता है। पर्याप्त नींद उतनी ही जरूरी है जितनी पढ़ाई, क्योंकि सोते समय ही दिमाग दिन भर में सीखी गई बातों को व्यवस्थित करता है। देर रात तक मोबाइल फोन देखने की आदत नींद को खराब करती है, इसलिए सोने से पहले कुछ समय स्क्रीन से दूर रहना अच्छा है। पढ़ाई के बीच छोटे छोटे विराम लेना, पानी पीते रहना और परिवार या मित्रों से बात करना मन को हल्का रखता है। याद रखिए कि परीक्षा के दिन वही विद्यार्थी अपना सर्वश्रेष्ठ दे पाता है जिसका शरीर और मन दोनों स्वस्थ हों।`,
  },
  {
    id: "hi-digital-bharat",
    lang: "hi",
    title: "डिजिटल सेवाएँ",
    text: `पिछले कुछ वर्षों में हमारे देश में डिजिटल सेवाओं का तेजी से विस्तार हुआ है। आज गाँव में रहने वाला व्यक्ति भी मोबाइल फोन के माध्यम से बैंक खाते की जानकारी देख सकता है, बिजली का बिल जमा कर सकता है और सरकारी योजनाओं के लिए आवेदन कर सकता है। पहले इन कामों के लिए लोगों को कई बार दफ्तरों के चक्कर लगाने पड़ते थे और पूरा दिन लाइन में खड़े रहना पड़ता था। डिजिटल भुगतान ने छोटे दुकानदारों और ग्राहकों दोनों का काम आसान बना दिया है, क्योंकि अब खुले पैसों की समस्या नहीं रहती और हर लेन देन का रिकॉर्ड अपने आप बन जाता है। ऑनलाइन शिक्षा के कारण दूर दराज के विद्यार्थी भी अच्छे शिक्षकों से पढ़ पा रहे हैं और परीक्षाओं की तैयारी कर रहे हैं। लेकिन इन सुविधाओं के साथ कुछ सावधानियाँ भी जरूरी हैं। किसी भी अनजान व्यक्ति को अपना पिन, पासवर्ड या मोबाइल पर आया कोड कभी नहीं बताना चाहिए। अनजान लिंक पर क्लिक करने और संदिग्ध ऐप डाउनलोड करने से भी बचना चाहिए। डिजिटल साक्षरता बढ़ाना आज की बड़ी जरूरत है, ताकि हर नागरिक इन सेवाओं का सुरक्षित और पूरा लाभ उठा सके।`,
  },
  {
    id: "hi-paryavaran",
    lang: "hi",
    title: "पर्यावरण और हम",
    text: `पर्यावरण का अर्थ है हमारे चारों ओर का वह वातावरण जिसमें हवा, पानी, मिट्टी, पेड़ पौधे और सभी जीव जंतु शामिल हैं। मनुष्य का जीवन पूरी तरह से इसी पर्यावरण पर निर्भर है, फिर भी विकास की दौड़ में हमने इसे बहुत नुकसान पहुँचाया है। शहरों में वाहनों और कारखानों के धुएँ से हवा प्रदूषित हो रही है, नदियों में कचरा और गंदा पानी बहाया जा रहा है और जंगल तेजी से कट रहे हैं। इसका परिणाम हमें बढ़ती गर्मी, अनियमित वर्षा और साँस से जुड़ी बीमारियों के रूप में दिखाई दे रहा है। पर्यावरण की रक्षा के लिए बड़े बड़े कानूनों के साथ साथ हमारी रोज की आदतें भी बहुत मायने रखती हैं। प्लास्टिक की थैलियों की जगह कपड़े का थैला रखना, बिजली और पानी की बचत करना, कम दूरी के लिए पैदल चलना या साइकिल का उपयोग करना ऐसे ही छोटे कदम हैं। हर वर्ष कुछ पेड़ लगाना और उनकी देखभाल करना भी एक अच्छी शुरुआत हो सकती है। विद्यालयों में बच्चों को प्रकृति से जोड़ने वाली गतिविधियाँ उन्हें जिम्मेदार नागरिक बनाती हैं। धरती हमें पूर्वजों से विरासत में नहीं मिली, बल्कि हमने इसे अपनी आने वाली पीढ़ियों से उधार लिया है।`,
  },
  {
    id: "hi-samay-prabandhan",
    lang: "hi",
    title: "समय का सदुपयोग",
    text: `समय एक ऐसा संसाधन है जो सबको बराबर मिलता है, लेकिन इसका उपयोग हर व्यक्ति अलग ढंग से करता है। जो लोग अपने समय की योजना बनाकर चलते हैं, वे कम समय में अधिक काम कर लेते हैं और फिर भी आराम के लिए समय निकाल लेते हैं। प्रतियोगी परीक्षा की तैयारी में समय का सही प्रबंधन सफलता की सबसे बड़ी कुंजी है। सबसे पहले पूरे पाठ्यक्रम को छोटे छोटे भागों में बाँट लेना चाहिए और हर सप्ताह के लिए स्पष्ट लक्ष्य तय करने चाहिए। दिन की शुरुआत में सबसे कठिन विषय पढ़ना अच्छा रहता है, क्योंकि उस समय मन ताजा होता है। पढ़ाई के बीच मोबाइल फोन को दूर रखने से ध्यान बार बार नहीं भटकता। नियमित रूप से अभ्यास प्रश्न हल करना और समय सीमा के साथ मॉक टेस्ट देना परीक्षा भवन के दबाव के लिए तैयार करता है। हर सप्ताह के अंत में यह देखना उपयोगी है कि कौन से लक्ष्य पूरे हुए और कौन से छूट गए, ताकि अगली योजना बेहतर बन सके। समय का सदुपयोग करने का अर्थ लगातार काम करते रहना नहीं है, बल्कि सही समय पर सही काम करना है।`,
  },
  {
    id: "hi-kisan",
    lang: "hi",
    title: "किसान और खेती",
    text: `भारत को कृषि प्रधान देश कहा जाता है, क्योंकि आज भी देश की एक बड़ी आबादी अपनी आजीविका के लिए खेती पर निर्भर है। किसान दिन रात मेहनत करके अनाज, दालें, फल और सब्जियाँ उगाता है, जिनसे पूरे देश का पेट भरता है। फिर भी खेती से जुड़ी कई कठिनाइयाँ हैं। अनेक क्षेत्रों में खेती पूरी तरह वर्षा पर निर्भर है, इसलिए कम या अधिक बारिश से फसलें खराब हो जाती हैं। छोटे खेतों, महँगे बीज और खाद तथा उपज का उचित दाम न मिलना भी किसानों की बड़ी समस्याएँ हैं। इन चुनौतियों से निपटने के लिए नई तकनीकों का उपयोग बढ़ रहा है। मिट्टी की जाँच से यह पता चलता है कि खेत में किस पोषक तत्व की कमी है, जिससे खाद का सही मात्रा में उपयोग हो सके। टपक सिंचाई से पानी की बचत होती है और फसल बीमा योजनाएँ प्राकृतिक आपदा के समय सहारा देती हैं। किसान उत्पादक संगठन छोटे किसानों को मिलकर बीज खरीदने और अपनी उपज बेचने में मदद करते हैं। जब किसान समृद्ध होगा, तभी गाँव और पूरा देश समृद्ध होगा।`,
  },
  {
    id: "hi-pustakalaya",
    lang: "hi",
    title: "पुस्तकों का महत्व",
    text: `पुस्तकें मनुष्य की सबसे अच्छी मित्र मानी जाती हैं। वे बिना कुछ माँगे हमें ज्ञान देती हैं, कठिन समय में हिम्मत बढ़ाती हैं और हमें घर बैठे दूर देशों और बीते युगों की सैर कराती हैं। अच्छी पुस्तकें पढ़ने से हमारी भाषा समृद्ध होती है, सोचने का दायरा बढ़ता है और दूसरों की भावनाओं को समझने की क्षमता विकसित होती है। आज के समय में जब अधिकतर लोग मोबाइल पर छोटे छोटे वीडियो देखने में समय बिताते हैं, किसी पुस्तक को ध्यान से पढ़ना एक दुर्लभ आदत बनती जा रही है। प्रतियोगी परीक्षा के विद्यार्थियों के लिए पढ़ने की आदत विशेष रूप से लाभदायक है, क्योंकि इससे गद्यांश समझने की गति बढ़ती है और सामान्य ज्ञान भी मजबूत होता है। सार्वजनिक पुस्तकालय उन विद्यार्थियों के लिए वरदान हैं जो महँगी किताबें नहीं खरीद सकते या जिनके घर में पढ़ने के लिए शांत जगह नहीं है। रोज केवल बीस मिनट पढ़ने का नियम बनाकर भी इस आदत की शुरुआत की जा सकती है। नए शब्दों और रोचक तथ्यों को एक कॉपी में लिखते रहना पढ़ी हुई बातों को लंबे समय तक याद रखने में मदद करता है।`,
  },
  {
    id: "hi-yatayat",
    lang: "hi",
    title: "सड़क सुरक्षा",
    text: `सड़क दुर्घटनाएँ हमारे देश की एक गंभीर समस्या हैं, जिनमें हर वर्ष बड़ी संख्या में लोग अपनी जान गँवाते हैं या घायल होते हैं। इनमें से अधिकतर दुर्घटनाएँ तेज रफ्तार, लापरवाही से वाहन चलाने, लाल बत्ती पार करने और वाहन चलाते समय मोबाइल फोन के उपयोग के कारण होती हैं। थोड़ी सी सावधानी से इन दुर्घटनाओं को काफी हद तक रोका जा सकता है। दोपहिया वाहन चलाने वाले और पीछे बैठने वाले दोनों को अच्छी गुणवत्ता का हेलमेट पहनना चाहिए और उसकी पट्टी ठीक से बाँधनी चाहिए। कार में आगे और पीछे बैठे सभी लोगों को सीट बेल्ट लगानी चाहिए। पैदल चलने वालों को सड़क पार करते समय जेबरा क्रॉसिंग का उपयोग करना चाहिए और दोनों ओर देखकर ही आगे बढ़ना चाहिए। नशे की हालत में वाहन चलाना न केवल कानूनी अपराध है, बल्कि अपनी और दूसरों की जान के साथ खिलवाड़ भी है। दुर्घटना होने पर घायल व्यक्ति को जल्द से जल्द अस्पताल पहुँचाना बहुत जरूरी है, क्योंकि शुरुआती समय में मिला इलाज जान बचा सकता है। धैर्य और नियमों का पालन ही सुरक्षित यात्रा का सबसे सरल मंत्र है।`,
  },
];

export const PASSAGE_BY_ID = new Map(PASSAGES.map((p) => [p.id, p]));
