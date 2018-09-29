# HELPY, UX Scenario based Disaster Information Chatbot Service

*Chatbot information service specialized in disaster based on user’s context UX(User Experience) scenario.*

**Click [[here]](https://my.readymag.com/edit/1174290/1/) to view the details of the project.**

![image](https://user-images.githubusercontent.com/42545200/46241805-ef11e300-c3f9-11e8-9b88-627354132002.png)

## What problems?

The idea of Helpy Chatbot came from discovering that the users encounter problems in using disaster application services. 

You will face the following problems if you try to search for disaster related information.

#### **[1. Disaster information hard for user’s access]()**
- The disaster applications have too many texts, and too many categories or sub-categories.
- UI(User Interface) without considering the specificity of disaster service : Lack of Accessibility & Clarity 
- The access process to information is very complicated.

#### **[2. Provides extensive information(Action instructions) without considering user’s context]()**

Users experience disaster in various environment and situation. However, it is difficult to find the specific information from the disaster manuals that are limited to general situations.

- For example  (situation 1) : Those who hear a tornado coming would not have time to search for extensive information on where to go or what to do. The general disaster manual provides the instruction, ’Get into your basement now!’. But, they need to search for another resolution if they do not have a basement.
- For example (situation 2) : The earthquakes disaster manual instructs to hide below the table. But, the user doesn’t have a table nearby to hide. What if the user is at the beach? Or at the mountain? Or in the middle of having shower? Or Are you with an elderly?

When the user experiences a situation similar to the two examples previously mentioned, the user will say, __’What should I do?’, 'How can I find the information that suits my situation?’_


#### **[3. The disaster notification message is too general to help the user]()**

- Say, there was a disaster notification message, ‘Earthquake 6km Northwest of San Francisco’.
The user would probably say, _‘I need specific disaster information for where I am!’,_ after reading the message.

If you want to see further details of the  problem report, Click **[[here]](https://my.readymag.com/edit/1174290/1/)**

## Identification of key finding through IBM Design Thinking & Research
> **_From the previously mentioned, it can be seen that it is important to provide intuitive information considering the user’s circumstance._**

-	Difficulty in searching for information(disaster manual).
-	Need someone that can help overcome the situation confronted together.
-	Need device to contact neighbors or public organizations.
-	Need to record damage status of disaster.
-	Need procedures guidelines for various situations before/after a disaster.

## Why should the information providing method be improved?

> It is important to improve the information providing method, since the extent of disaster damage largely depends on how the information is used and provided.

> Improve information providing method through Chatbot 

**Q.** _Why should the information providing method based on chatbot be improved?_
#### Advantage of Chatbot
-	Simple search for information
-	Easy and quick access to desired information
-	Small, but cheer-up things during the communication
-	Extendability of the platform as it is capable of providing services to users by connecting various services

## Solution
We have developed the information chatbot service, Helpy, during IBM design thinking & mentoring program to resolve the problems users encounter.

### Service Categories
- Chatbot(chatting)
- Sharing map
- Setting

### Key features

**1. Chatbot**
- Provides 1 on 1 disaster information according to the user context
- Information simplification and intuitiveness enhancement through chatbot

**2. User-friendly and scenario-based guideline** 
- Disaster information
- Action Plans
- Evacuation (Shelter location and direction

**3. Report & SOS**
- User can ask for help, or be the angel to help others.
(Through Google map API, The shortest distance, route and time between one user requesting for the help and the other user requesting the help can be identified.)
- Accurate information for effective rescue
- Appropriate location and situation info delivery

**2. Sharing map** 
- Disaster sharing map that users build
- Helpy does not simply provide information. With the sharing map, Helpy allows users to share disaster information and situations real time. (Citizen-participation, The power of collective action
Empathy: You’re not alone !) 
- Provides disaster map made by interaction between chatbot and user
- The sharing map can be used as data to directly/indirectly track how disaster is felt when the authorities diagnose the event. 

## Service flow & Architecture

![image](https://user-images.githubusercontent.com/42545200/46223993-f43a4800-c38f-11e8-9505-b84636e375d6.png)


Helpy is a Framework7 based mobile web-page and server was configured through Node.js.

1. _Chatting_ : Users send text(chatting) or voice
2. _Chatting_ : Before start chatting, it fetches corresponding information from weather & disaster API through preprocess.
3. _Chatting_ : Receive the response by transforming the voice into text format through STT and sending to Wastson Assistant.   
4. _Chatting_ : After received the information stored in Google Map or Cloudant, it shows to users.
5. _Chatting_ :  If user asks chatbot how to escape an earthquake, Watson Assistant will analyze the text and its intention. Based on the analysis, it will call out the appropriate method for the user to escape in their situation from Cloudant’s data. This will enable the user to be informed of the disaster manual considering their situation using Cloudant’s data which includes instructions for various cases.
6. _Chatting/Sharing map_ : When the user asks the chatbot how to escape, Watson Assistant calls way of escape to the Cloudant data by analyzing words and intents of the user.
7. _Sharing map_ : In a chat/sharing map, data about disaster situations reported by users through camera functionality is stored in Cloudant, and users can check their report details. 
8. _Sharing map_ : Through Google map API, The shortest distance, route and time between one user requesting for the help and the other user requesting the help can be identified.
9. _Setting_ : User can set up disaster information notification. When a user sets up to receive a notification, corresponding information is called from weather & disaster information API. 
10. _Setting_ : Emergency contacts can be registered in Cloudant DB.

## **Featured technologies & Included Components**

- IBM AI Watson Conversation (Assistant)
- Watson Speech to Text
- IBM Cloudant
- Node.js
- Framework 7 

### **Here’s our principles**
Helpy built based on IBM Watson analyzes user’s words, understands intent and provides disaster information based on user’s situation. 

![image](https://user-images.githubusercontent.com/42545200/46230671-45543700-c3a4-11e8-82b3-c3bacef5ab01.png)

(1) Analyze and identify user’s words and intents

(2) Disaster data call based on user's situations

(3) Forward information to users


## Utilized data

**[1. Disaster Information(data)]()**

This project used arbitrary data made assuming a disaster due to the following constraints. Considering the period and resource of the project, the target region of this project was limited to New York, United States.
- For the case of South Korea, weather and disaster data information can be found from public API provided by the government operated site, data.go.kr. On the other hand, for the case of USA, there were difficulties to collect data because corresponding API is not standardized or not opened to the public. 
- In addition, real disaster situation has to occur to perform the test of corresponding helpy services. However, testing was difficult because no real disaster situation can occur when using actual API. 

Therefore, we developed the service under the assumption that government can provide API that can fetch public data.

**[2. Disaster Manual & Reference]()**

Helpy is capable of providing instructions for 20 main situations based on the official disaster manuals such as FEMA, NCDP, etc.

- [FEMA](https://www.fema.gov/media-library/assets/documents/109040)
- [NYC.gov](https://www1.nyc.gov/site/em/ready/earthquakes.page )
- [usa.gov](https://www.usa.gov/after-disaster)
- [NCDP](https://ncdp.columbia.edu/library/publications/)
- [ready.gov](https://www.ready.gov)
- [disasterassistance.gov](https://www.disasterassistance.gov/)

## Watch the Video(Demo)

![image](https://user-images.githubusercontent.com/42545200/46242110-3b135680-c3ff-11e8-8921-2fd0a3f70406.png)
https://vimeo.com/292444609

## What is the difference/value of HELPY service?

- Not limited to simple conversation tool. User, chatbot, and other users will be able to interact and prepare for disaster with our chatbot.
- Expands as an emotional communication tool between technology and user.
- Information service that sympathize with user’s situation and solve problems.
- Provides practical information to the user considering UX/User's context. 
(Provides 1 on 1 disaster information according to the user context)

## Scalability
Helpy is currently programmed with disaster information and evacuation tips only when earthquake occurs. However, helpy service can be scalable to various disaster situation like wildfire, hurricane, etc. (not limited to earthquake)

Helpy service has potential to bring the value to people in the future because the code is written in a well-organized way with scenario planning regarding API disaster data utilization process, chatbot handling process, disaster manual based on various situations.


## Team members & Role

> Team name : Macaroon

#### _MinKyoung Kim_ _(Team Leader)_ / kmkjkim12@gmail.com
UX research & analysis, Service UX/UI,
CUI(Conversation User Interface) design,
User scenarios/service flow guideline based on Watson conversation system,
Input guideline for service scenario in the Watson conversation system,
Visual(graphic) design, Concept video editing

#### _SangEon Jin_ / jinsw2001@gmail.com / [_(Profile)_](https://www.linkedin.com/in/sang-eon-jin-31a010172/)
Back-end development,
Verification & Validation of Watson-chatbot service 

#### _KwanWoo You_ / skymill2000@gmail.com / [**_(Profile)_**](www.linkedin.com/in/gwanwoo-you-50017a142)
Front-end development,
Back-end development(Draft)


#### _ChiHun Lee_ / ch279lee@gmail.com
UX Copywriting(Technical writing),
UX Research

#### (Assistant) _JaeHee Lee_ / jaehee97@gmail.com



## Thanks to

_Thank you for your advice/help on the project :)_
#### [_JaeHo Kim_](https://www.linkedin.com/in/jaeho-kim-352717171/), _JinGi Kong_, _MinSeok Kim_, _JungSeok Hong_, _[HyeonJi Jung](http://hadoobidoop.tistory.com/)_, _KwonTaek Lim_, _WooJung Seok_, _KISA(Korea Internet & Security Agency)_

