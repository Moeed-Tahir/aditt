"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-7xl mt-20 mx-auto mb-6">
        <div className="flex items-center mb-6">
          <Link
            href="/signup-user"
            className="py-2 px-5 ml-5 rounded-full bg-white text-gray-700 border hover:bg-blue-600 hover:text-white transition flex items-center gap-2"
          >
            <ArrowLeft />
            Back
          </Link>

          <div className="flex-1 text-center text-lg font-medium">
            Privacy Policy
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow p-8 relative">
        <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-sm mb-6">Effective as of July 14, 2025</p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Introduction</h2>
        <p className="text-sm mb-4">
          Aditt, LLC ("Aditt", "we", "our" or "us") is committed to protecting your privacy. This privacy policy ("Policy") describes the types of personal information we collect through our website at https://www.aditt.app and any related applications, features or services (collectively, the "Platform"), how we use that information, who we share it with, and the choices you can make about our collection, use and disclosure of that information.
        </p>
        <p className="text-sm mb-4">
          By visiting the website and using the Platform provided by Aditt, you consent to our use and processing of your information as set forth herein. This policy does not apply to third parties that Aditt does not own or control.
        </p>
        <p className="text-sm mb-6">
          You acknowledge that the Platform is built to function in conjunction with Stripe, Inc. ("Stripe") digital payments processing platform which is utilized to facilitate financial transactions between Aditt, its Advertisers and its Users. All payment processing is conducted by Stripe. As such, should you engage in financial transactions on the Platform, these transactions will also be governed by the Stripe privacy policy available at https://stripe.com/privacy as applicable. For more information about how Stripe uses, collects and provides you with information in the course of executing transactions and processing payments please consult the aforementioned policies.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Data Collection and Use</h2>
        <p className="text-sm mb-4">
          Personal data, or personal information, means any information about an individual from which that person can be identified. It does not include data where the identity has been removed (anonymous data). We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
        </p>
        <ul className="list-disc pl-5 mb-4 text-sm space-y-2">
          <li><strong>Identity Data</strong> includes name, title, date of birth and gender.</li>
          <li><strong>Contact Data</strong> includes mailing/billing address, email address and telephone numbers.</li>
          <li><strong>Financial Data</strong> includes bank account and payment card details.</li>
          <li><strong>Transaction Data</strong> includes details about payments to and from you and other details of products and services you have used or purchased from us.</li>
          <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this Platform.</li>
          <li><strong>Profile Data</strong> includes your username and password, purchases or orders made by you (or by your employer on your behalf), your interests, preferences, feedback and survey responses.</li>
          <li><strong>Usage Data</strong> includes information about how you use our Platform, products and services.</li>
          <li><strong>Marketing and Communications Data</strong> includes your preferences in receiving marketing from us and our third parties and your communication preferences.</li>
        </ul>
        <p className="text-sm mb-4">
          We also collect, use and share Aggregated Data such as statistical or demographic data for any purpose. Aggregated Data could be derived from your personal data but is not considered personal data in law as this data will not directly or indirectly reveal your identity. For example, we may aggregate your Usage Data to calculate the percentage of users accessing a specific website feature. However, if we combine or connect Aggregated Data with your personal data so that it can directly or indirectly identify you, we treat the combined data as personal data which will be used in accordance with this privacy policy.
        </p>
        <p className="text-sm mb-6">
          We do not collect any Special Categories of Personal Data about you (this includes details about your race or ethnicity, religious beliefs, sex life, sexual orientation, political opinions, trade union membership, information about your health, and genetic and biometric data). Nor do we collect any information about criminal convictions and offences.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">How we collect this information</h2>
        <p className="text-sm mb-4">
          We use different methods to collect data from and about you including: (i) directly from you when you provide it to us; (ii) automatically as you navigate through the site; and (iii) from third parties, for example our business partners; each as described in greater detail below. Information collected automatically may include usage details, IP addresses, and information collected through cookies, web beacons, and other tracking technologies.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-2">Information You Provide to Us</h3>
        <p className="text-sm mb-4">
          The information we collect on or through our Platform may include:
        </p>
        <ul className="list-disc pl-5 mb-4 text-sm space-y-2">
          <li>Information that you provide by filling in forms on our Platform. This includes information provided at the time of registering to use our Platform, subscribing to our service, posting material, or requesting further services. We may also ask you for information when you report a problem with our Platform.</li>
          <li>Records and copies of your communications with us, including, but not limited to, chat and email correspondence and communications relating to account verification and management, security notices, and help and support.</li>
          <li>Details of transactions you carry out through our Platform and of the fulfillment of your orders. You may be required to provide financial information before placing an order through our Platform.</li>
          <li>Your search queries on the Platform.</li>
          <li>Testimonials and feedback you provide regarding your use of the Platform and services.</li>
        </ul>
        <p className="text-sm mb-4">
          We use third-party analytics tools to help us measure traffic and usage trends for the Platform. These tools collect information sent by your device or our Platform that assists us in improving the Platform.
        </p>
        <p className="text-sm mb-4">
          We use commercially reasonable safeguards to help keep the information collected through the Platform secure and take reasonable steps (such as requesting a unique password and username) to verify your identity before granting you access to your account. However, Aditt cannot ensure the security of any information you transmit via the Platform or guarantee that information on the Platform may not be accessed, disclosed, altered, or destroyed.
        </p>
        <p className="text-sm mb-4">
          You are responsible for maintaining the secrecy of your unique password and account information. If you believe the Platform's security has been breached, you agree to notify Aditt immediately.
        </p>
        <p className="text-sm mb-6">
          We may remove parts of data that can identify you and share anonymized data with other parties. We may also combine your information with other information in a way that it is no longer associated with you and share that aggregated information.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-2">Information We Collect Through Automatic Data Collection Technologies</h3>
        <p className="text-sm mb-4">
          As you navigate through and interact with our Platform, we may use automatic data collection technologies to collect certain information about your equipment, browsing actions, and patterns, including: (i) details of your visits to our Platform, including traffic data, location data, logs, and other communication data and the resources that you access and use on the Platform; and (ii) information about your computer and internet connection, including your IP address, operating system, browser type, MAC address, unique device identifier, International Mobile Equipment Identity ("IMEI") and mobile network information. We also create and store information about our users in logs. The logged information includes IP addresses, endpoints you use, and if there are any errors, we store information to diagnose and correct any problems with the Platform.
        </p>
        <p className="text-sm mb-4">
          The information we collect automatically may include personal information or we may maintain or associate your information with personal information we collect in other ways or receive from third parties. It helps us to improve our Platform and to deliver a better and more personalized service, including by enabling us to: (i) estimate our audience size and usage patterns; (ii) store information about your preferences, allowing us to customize our Platform according to your individual interests; (iii) speed up your searches; and (iv) recognize you when you return to our Platform.
        </p>
        <p className="text-sm mb-4">
          The technologies we may use for this automatic data collection may include:
        </p>
        <ul className="list-disc pl-5 mb-4 text-sm space-y-2">
          <li><strong>Cookies</strong> – Cookies are small text files that contain a string of characters. Aditt uses cookies to uniquely identify an Internet browser. Certain browsers or browser settings sometimes block cookies, and cookies may not work effectively on some mobile devices. For more information about cookies, please visit http://www.allaboutcookies.org/.</li>
          <li><strong>Mobile Advertising Identifiers</strong> – Mobile advertising IDs (e.g., Apple's IDFA or Google's AAID) are unique IDs that are associated with individual mobile devices and that do not reveal your real world identity. They usually are user-resettable.</li>
          <li><strong>Pixel Tags</strong> – Pixel tags (also commonly known as web beacons) are transparent images, iFrames, or JavaScript that our clients and partners use to understand how consumers interact with them online, including on websites and in mobile apps.</li>
          <li><strong>Statistical IDs</strong> – Statistical IDs are created via an algorithm using pseudonymous information about your computer or device, including your operating system, user-agent string, IP address, Internet browser, installed fonts, and similar information. This information makes your computer or device distinct enough for our systems to determine within a reasonable probability that they are encountering the same computer or device, including in environments where Aditt and 3rd party vendor cookies are not supported.</li>
          <li><strong>Flash Cookies</strong> - Certain features of our Platform may use local stored objects (or Flash cookies) to collect and store information about your preferences and navigation to, from, and on our Platform. Flash cookies are not managed by the same browser settings as are used for browser cookies.</li>
          <li><strong>Web Beacons</strong> - Pages of the Platform may contain small electronic files known as web beacons (also referred to as clear gifs, pixel tags, and single-pixel gifs) that permit the Company, for example, to count users who have visited those pages and for other related website statistics (for example, recording the popularity of certain website content and verifying system and server integrity).</li>
        </ul>
        <p className="text-sm mb-6">
          You can set your browser to refuse all or some browser cookies, or to alert you when cookies are being sent. Disabling cookies may impact how you view and interact with the Platform, including rendering some features unusable. To learn how you can manage your Flash cookie settings, visit the Flash player settings page on Adobe's website. If you disable or refuse cookies, please note that some parts of this site may then be inaccessible or not function properly.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-2">Information About You We May Receive from Third Parties</h3>
        <p className="text-sm mb-4">
          We may receive personal data about you from various third parties and public sources including:
        </p>
        <ul className="list-disc pl-5 mb-6 text-sm space-y-2">
          <li>analytics providers including, but not limited to Google Hotjar, Albacross, Heap, Intercom, and Salesflare.</li>
          <li>advertising networks and publishers including, but not limited to Google, Bing, Facebook and Instagram</li>
          <li>Contact, financial and transaction data from providers of technical and payment services, including, but not limited to Stripe.</li>
          <li>Identity and contact data from data brokers or aggregators including, but not limited to LiveRamp, Snov.io, Albacross, Hunter.io, and Clearbit</li>
          <li>Identity and contact data from publicly available sources.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3">Use of Information</h2>
        <p className="text-sm mb-4">
          We may use information that we collect about you or that you provide to us, including any personal information:
        </p>
        <ul className="list-disc pl-5 mb-4 text-sm space-y-2">
          <li>To present our Platform and its contents and services to you, including, but not limited to, assisting you in creating Campaigns and placing advertisements via our third party service providers and partners.</li>
          <li>To provide you with information, products, or services that you request from us.</li>
          <li>To notify you about changes to our Platform or any products or services we offer or provide though it or other products or services which may be of interest to you</li>
          <li>To analyze trends and conduct research about improving our products, services and Platform.</li>
          <li>To correlate information with other commercially available information to identify demographics and preferences to assist us in marketing efforts.</li>
          <li>To contact users for research, informational or marketing purposes.</li>
          <li>To learn about our users' needs.</li>
          <li>To address information security and/or privacy practices control, network functioning, engineering, and troubleshooting issues.</li>
          <li>To investigate claims and/or legal actions, violations of law or agreements, and compliance with relevant applicable laws and legal process.</li>
          <li>To comply with law, or based on our good-faith belief that it is necessary to conform or comply with the law, or otherwise to disclose information to prevent fraud and reduce credit risks, to cooperate with police and other governmental authorities, or to protect the rights, property or safety of visitors to the Platform or the public.</li>
          <li>To process or engage in a sale of all or part of our business, or if we go through a reorganization or merger.</li>
          <li>To fulfill any other purpose for which you provide it.</li>
          <li>To provide you with notices about your account/subscription, including expiration and renewal notices.</li>
          <li>To carry out our obligations and enforce our rights arising from any contracts entered into between you or your employer and us, including for processing credit cards, billing and collection.</li>
          <li>In any other way we may describe when you provide the information.</li>
          <li>For any other purpose with your consent.</li>
        </ul>
        <p className="text-sm mb-4">
          We may also use your information to contact you about our own goods and services that may be of interest to you and to display advertisements to you when you visit other websites via our third party ad placement vendors. We will get your consent before sending direct marketing communications to you via email or text message.
        </p>
        <p className="text-sm mb-6">
          You can ask us or third parties to stop sending you marketing messages at any time by (i) by following the opt-out links on any marketing message sent to you; or (ii) by contacting us at any time. Where you opt out of receiving these marketing messages, this will not apply to personal data provided to us as a result of a product/service experience or other transactions.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Opt-Out</h2>
        <p className="text-sm mb-4">
          If you are served an advertisement over the Internet that you believe may have been created or placed by a user of the Platform you can find information regarding opting out of such advertisements and related data collection by consulting the relevant advertiser's published privacy policy.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-2">Other ways to opt out</h3>
        <p className="text-sm mb-4">
          You may learn more about interest-based advertising and opt out of interest-based advertising that are also members of applicable self-regulatory organizations by visiting their opt-out links:
        </p>
        <ul className="list-disc pl-5 mb-4 text-sm space-y-2">
          <li>Network Advertising Initiative (NAI) – http://www.networkadvertising.org/choices/</li>
          <li>Digital Advertising Alliance (DAA) – http://www.aboutads.info/choices/</li>
          <li>Digital Advertising Alliance Canada (DAAC) – http://youradchoices.ca/choices</li>
          <li>Digital Advertising Alliance EU (EDAA) – http://www.youronlinechoices.com/</li>
          <li>DAA AppChoices page – http://www.aboutads.info/appchoices</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4 mb-2">Other ways to exercise choice</h3>
        <p className="text-sm mb-4">
          You may also limit ad tracking in mobile app environments on your device. For the most effective and up-to-date methods for doing so, you should consult instructions provided by those device manufacturers. We offer the following information solely for informational purposes, and we cannot guarantee that the methods below are the most current:
        </p>
        <p className="text-sm mb-4">
          Apple instructions for how to Limit Ad Tracking on devices such as iPhones and iPads
        </p>
        <p className="text-sm mb-4">
          Google instructions for how to express choice on Android devices
        </p>
        <p className="text-sm mb-6">
          Where Aditt receives a signal to limit ad tracking, we will not serve interest-based advertising in the mobile app environment of that device. If you have questions about how to opt out or limit mobile tracking, please contact us at info@aditt.app.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Your California and Other State Privacy Rights</h2>
        <p className="text-sm mb-4">
          The California Consumer Privacy Act ("CCPA"), as amended by the California Privacy Rights Act ("CPRA"), provides California residents with specific rights regarding their personal information. If you are a California resident, your rights are described below. If you have any questions about whether any of the following applies to you, please email us at info@aditt.app.
        </p>
        <p className="text-sm mb-4">
          You have the right to request certain information about our collection and use of your personal information over the past 12 months, including the following:
        </p>
        <ul className="list-disc pl-5 mb-4 text-sm space-y-2">
          <li>The categories of personal information that we have collected about you, as those categories are defined under the CCPA and CPRA.</li>
          <li>The categories of sources from which that personal information was collected.</li>
          <li>The business or commercial purpose for collecting or selling your personal information.</li>
          <li>The categories of third parties with whom we have shared your personal information.</li>
          <li>The specific pieces of personal information that we have collected about you.</li>
          <li>If we have disclosed your personal information for a business purpose over the past 12 months, we will identify the categories of personal information shared with each category of third-party recipient.</li>
        </ul>
        <p className="text-sm mb-4">
          In addition to the rights described above, California law requires disclosure of the categories of personal information collected and shared with our affiliates over the past 12 months. Those categories, as described by the CCPA and CPRA, consist of the following:
        </p>
        <ul className="list-disc pl-5 mb-4 text-sm space-y-2">
          <li>Identifiers, including name, email address, IP address, and an ID or number assigned to your data.</li>
          <li>Customer Records Information including telephone numbers.</li>
          <li>Internet activity, including your interactions with our Platform and what led you to our Platform.</li>
          <li>Commercial information, including records of the products or Platform you have purchased.</li>
        </ul>
        <p className="text-sm mb-4">
          If we have sold your personal information over the past 12 months, we will identify the categories of personal information purchased by each category of third-party recipient. AT THIS TIME COMPANY DOES NOT SELL ANY PERSONAL INFORMATION AND HAS NOT SOLD ANY SUCH INFORMATION IN THE LAST TWELVE (12) MONTHS.
        </p>
        <p className="text-sm mb-4">
          If you are a California resident you have the right to request correction or deletion of the personal information that we have collected from you, as well as ceasing the sharing of any personal information we have collected from you subject to limited exceptions: for example, we may retain personal information to complete a transaction with you, or we may retain information that would affect the privacy of others or interfere with legal requirements. If your deletion request is subject to an exception under the CCPA or CPRA we may deny your deletion request.
        </p>
        <p className="text-sm mb-4">
          To exercise the rights described above, you should send us written request via email to info@aditt.app or via the Company address listed below. Please ensure that your request (1) provides sufficient information to allow us to verify that you are the person about whom we have collected personal information; and (2) provides sufficient detail to allow us to understand, evaluate, and respond to your request. We may not be obligated or able to respond to requests that do not meet these criteria.
        </p>
        <p className="text-sm mb-4">
          For your security we may require you to verify your identity before we can act on your request. There may be information we will not return in response to your access request, such as information that would affect the privacy of others or interfere with legal requirements. Similarly, there may be reasons why we cannot comply with your deletion request, such as the need to keep your personal information to fulfill a legal obligation.
        </p>
        <p className="text-sm mb-4">
          Company will use commercially reasonable efforts to respond to any complete and valid request within 30 days of receipt. There is no cost to submit a valid request although Company may require a fee if your request(s) are excessive, repetitive, or unreasonable. You will not be charged a fee, and your fee-bearing request will not be processed, without Company providing you with prior written notice.
        </p>
        <p className="text-sm mb-4">
          Should you choose to exercise any of your rights under the CCPA or CPRA, Company will not deny you any Platform, charge you different rates, or provide lesser quality Platform. However, in the future Company may elect to offer different tiers of Platform as allowed by applicable laws which may contain differing prices, rates, or levels of quality, which may be related to the value of personal information that we receive from you.
        </p>
        <p className="text-sm mb-4">
          California Civil Code Section § 1798.83 permits users of the Platform that are California residents to request certain information regarding our disclosure of personal information to third parties for their direct marketing purposes. To make such a request, please send an email to info@aditt.app.
        </p>
        <p className="text-sm mb-6">
          If you are a resident of Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky, Maryland, Minnesota, Nebraska, New Hampshire, New Jersey, Oregon, Rhode Island, Tennessee, Texas Utah or Virginia you may have similar rights to know the categories of data we collect, use and disclose, as well as potential rights to request corrections or deletions of your data. To submit a request to know, correct or delete, please send an email info@aditt.app.We may be required to take certain steps to verify your identity before processing your request.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Data Collection and Retention on our Platform</h2>
        <p className="text-sm mb-4">
          Aditt collects personal information on the Platform when visitors choose to reveal it to us. For example, when you contact us to request a demonstration of our products or services or to otherwise send us questions, we will collect personal information such as your name and email address. Aditt uses information from the Platform log files to determine how you found out about us, what your interests are regarding our services, and how to further improve our site and our service towards you.
        </p>
        <p className="text-sm mb-6">
          If you create an account on our Platform, we will retain your information for as long as your account is active with us or for as long as you are receiving our services. After you have closed your account with us or ceased to use our services, we may retain and use your personal information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Communications From the Platform</h2>
        <p className="text-sm mb-6">
          When you sign up for our services on our Platform, we will use your name and email address to send Company updates to you. You may choose to stop receiving Company updates or marketing emails by following the unsubscribe instructions included in these emails or by contacting us via email at info@aditt.app.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Testimonials</h2>
        <p className="text-sm mb-6">
          We may display testimonials from satisfied clients on the Platform in addition to other endorsements. We will obtain our client's permission before we place these testimonials on the Platform. If you are a client who wishes to update or delete a testimonial, please contact us at info@aditt.app.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Service Providers</h2>
        <p className="text-sm mb-6">
          When you sign up for our services on the Platform, we may provide your personal information to companies that provide services to help us with our business activities, such as an email service provider to send emails on our behalf or a recruitment partner to process job application data. These companies are authorized to use your personal information only as necessary to provide these services to us.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Information Collected Automatically</h2>
        <p className="text-sm mb-4">
          As is true of most websites, we gather certain information automatically and store it in log files. This information may include IP address, browser type, Internet Service Provider (ISP), referring/exit pages, operating system, date/time stamp, and/or clickstream data. We do not link this automatically collected data to other information we collect about you. We collect information automatically through the use of various technologies including cookies. For further information on the cookies we use on the Platform and how you can opt out, please see our Cookie Notice.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Links and other websites</h2>
        <p className="text-sm mb-6">
          The Platform may contain links to other sites, and your Campaigns may generate and run advertisements on a variety of other sites. Please be aware that Aditt does not control these third party sites, ads and cookies and is not responsible for the privacy practices of such other sites. We encourage our users to be aware when they leave our Platform and to read the privacy statements of third party websites to find out how they collect and use your personal information and to establish whether and for what purpose they use cookies.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Data Sharing and Disclosure</h2>
        <p className="text-sm mb-4">
          We may disclose aggregated information about our users, and information that does not identify any individual, without restriction.
        </p>
        <p className="text-sm mb-4">
          We may disclose personal information that we collect or you provide as described in this privacy policy:
        </p>
        <ul className="list-disc pl-5 mb-4 text-sm space-y-2">
          <li>To our subsidiaries and affiliates.</li>
          <li>To contractors, service providers, and other third parties we use to support our business and who are bound by contractual obligations to keep personal information confidential and use it only for the purposes for which we disclose it to them. Such service providers may include payment processors for the purpose of processing your purchases on the Platform.</li>
          <li>To a buyer or other successor in the event of a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Company's assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which personal information held by Company about our Platform users is among the assets transferred.</li>
          <li>To fulfill the purpose for which you provide it. (e.g. payment processing)</li>
          <li>For any other purpose disclosed by us when you provide the information.</li>
          <li>With your consent.</li>
          <li>To comply with any court order, law, or legal process</li>
          <li>If we believe disclosure is necessary or appropriate to protect the rights, property, or safety of the Company, our customers, or others</li>
          <li>To enforce or apply the terms of our Advertiser Agreement on our website</li>
          <li>In addition, with your consent, we may share your information with third parties that provide products or services that you have requested and such third parties are not acting on our behalf in these instances. Please be aware that we are not responsible for the privacy practices of such third parties. We do not control these third parties' policies regarding the collection or use of your information. If you have any questions about the privacy practices of a third party, you should contact them directly.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3">Maintenance of Information</h2>
        <p className="text-sm mb-4">
          We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting or reporting requirements. We may retain your personal data for a longer period in the event of a complaint or if we reasonably believe there is a prospect of litigation in respect to our relationship with you.
        </p>
        <p className="text-sm mb-6">
          To determine the appropriate retention period for personal data, we consider the amount, nature and sensitivity of the personal data, the potential risk of harm from unauthorized use or disclosure of your personal data, the purposes for which we process your personal data and whether we can achieve those purposes through other means, and the applicable legal, regulatory, tax, accounting or other requirements.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Lawful Basis of Processing</h2>
        <p className="text-sm mb-4">
          We collect and process your personal information under the following lawful bases:
        </p>
        <ul className="list-disc pl-5 mb-4 text-sm space-y-2">
          <li>With your consent as provided hereunder including to send you marketing messages where you have provided consent;</li>
          <li>Performance of a contract with you;</li>
          <li>As necessary to comply with a legal obligation; and</li>
          <li>To fulfill our legitimate interest in conducting our business, where your interests and fundamental rights do not override those interests including, but not limited to:
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>providing the services for which you have enrolled;</li>
              <li>to keep our records updated;</li>
              <li>to study how customers use our products/services, to develop them and grow our business and inform our marketing strategy;</li>
              <li>for running our business, provision of administration and IT services, network security, to prevent fraud and in the context of a business reorganization or group restructuring exercises;</li>
              <li>contacting you about our products, or responding to your requests.</li>
            </ul>
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3">Change of Purpose</h2>
        <p className="text-sm mb-4">
          We will only use your personal data for the purposes for which we collected it, unless we reasonably consider that we need to use it for another reason and that reason is compatible with the original purpose. If you wish to get an explanation as to how the processing for the new purpose is compatible with the original purpose, please contact us.
        </p>
        <p className="text-sm mb-6">
          If we need to use your personal data for an unrelated purpose, we will notify you and we will explain the legal basis which allows us to do so. Please note that we may process your personal data without your knowledge or consent, in compliance with the above rules, where this is required or permitted by law.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Your Legal Rights</h2>
        <p className="text-sm mb-4">
          Under certain circumstances, you have rights under data protection laws in relation to your personal data, which may include rights to the following:
        </p>
        <ul className="list-disc pl-5 mb-4 text-sm space-y-2">
          <li>Request access to your personal data.</li>
          <li>Request correction of your personal data.</li>
          <li>Request erasure of your personal data.</li>
          <li>Object to processing of your personal data.</li>
          <li>Request restriction of processing your personal data.</li>
          <li>Request transfer of your personal data.</li>
          <li>Withdraw consent.</li>
        </ul>
        <p className="text-sm mb-4">
          If you wish to exercise any of the rights set out above, please contact us at info@aditt.app.
        </p>
        <p className="text-sm mb-4">
          You will not have to pay a fee to access your personal data (or to exercise any of the other rights). However, we may charge a reasonable fee if your request is clearly unfounded, repetitive or excessive. Alternatively, we could refuse to comply with your request in these circumstances. We may need to request specific information from you to help us confirm your identity and ensure your right to access your personal data (or to exercise any of your other rights). This is a security measure to ensure that personal data is not disclosed to any person who has no right to receive it. We may also contact you to ask you for further information in relation to your request to speed up our response.
        </p>
        <p className="text-sm mb-6">
          We try to respond to all legitimate requests within one month. Occasionally it could take us longer than a month if your request is particularly complex or you have made a number of requests. In this case, we will notify you and keep you updated.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Data Security and Integrity</h2>
        <p className="text-sm mb-4">
          Aditt implements technical and organizational measures to safeguard data in our possession against loss, theft, and unauthorized use, disclosure, or modification. No transmission of data over the Internet, however, is guaranteed to be completely secure. It may be possible for third parties not under the control of Aditt to intercept or access transmissions or communications unlawfully. While we strive to protect your information, we cannot ensure or warrant the security of any information you transmit to us. Aditt processes information in a way that is compatible with and relevant for the purpose for which it was collected. To the extent necessary for those purposes, we take reasonable steps to ensure that any information in our care is accurate, complete, current, and reliable for its intended use. If you have any questions about security on the Platform, you can contact us at info@aditt.app.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">International Transfer</h2>
        <p className="text-sm mb-4">
          Your information, including Personal Information, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from your jurisdiction.
        </p>
        <p className="text-sm mb-4">
          If you are located outside United States and choose to provide information to us, please note that we transfer the information, including Personal Information, to United States and process it there.
        </p>
        <p className="text-sm mb-4">
          Your consent to this Policy followed by your submission of such information represents your agreement to that transfer.
        </p>
        <p className="text-sm mb-4">
          Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Policy of every site you visit.
        </p>
        <p className="text-sm mb-6">
          We have no control over, and assume no responsibility for the content, privacy policies or practices of any third party sites or services.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Children's Privacy</h2>
        <p className="text-sm mb-4">
          By using this site, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.
        </p>
        <p className="text-sm mb-4">
          Only persons age 13 or older have permission to access our Service. Our Service does not address anyone under the age of 13 ("Children").
        </p>
        <p className="text-sm mb-6">
          We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you learn that your Children have provided us with Personal Information, please contact us at info@aditt.app. If we discover that a Child under 13 has provided us with Personal Information, we will delete such information from our servers.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Updates to this Policy</h2>
        <p className="text-sm mb-6">
          From time to time Aditt may revise this Policy. The date of the last update can be found at the top of this Policy. If we make revisions that materially change or affect whether or how we collect or use personal information we will notify you by email (if, as a user of our Platform, you have provided us your email address) or by means of a notice on our Platform prior to the change becoming effective. Therefore, you should review the Platform periodically so that you are up-to-date on our most current policies and practices.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Contact</h2>
        <p className="text-sm mb-6">
          If you have any questions about this Policy, please contact us as follows.<br />
          By email at info@aditt.app<br /><br />
          Your privacy is important to us and we will make every effort to resolve your concerns.
        </p>
      </div>
    </div>
  );
}