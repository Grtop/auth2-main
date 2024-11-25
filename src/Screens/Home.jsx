import React from 'react';
//import { useNavigate } from "react-router-dom";
import './style.css';



export default function HomePage() {

  const email = localStorage.getItem("email");
  const account = localStorage.getItem("account");
  //const navigate = useNavigate();

  return (
    <div>
      <nav className="nav-bar">
        <img src="https://i.yapx.ru/YK5OK.png" alt="AuthPrimus" width="100"/>
        <ul className="nav-items">
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Carriers</a></li>
        </ul>
        <a href="#" id="pull">Menu</a>  

        {localStorage.getItem("email")? (
        <button
         onClick={() => {
            localStorage.removeItem("email");
            localStorage.removeItem("account");
            window.location.reload();
          }}
         >
           Log out
        </button>
          ) : (
        <button onClick={() => window.location.href = "/sign-in"}>Sign in</button>
        )}
      </nav>
      <header className="hero-section">
        <div className="hero-text-container">
          <h1>
         Kibbarius <br/>
          New generation of API <br/>
          Modern authentication platform
          </h1>
          <p>
          Transfer your protection to the Blockchain! Your universal account<br />
          The only one in the applications, you do not need to remember the password, remaining
          under reliable protection. 
          </p>
          <button onClick={() => window.location.href = "/Signup"}>Sign up</button>
        </div>
        
      </header>

      <div className="container">
        <section className="why-us">
          <h1>Why choose AuthPrimus?</h1>
          <p>
          We use the blockchain to turn your account <br/>
          into a universal authentication tool.<br/>
          Come in easily and work with pleasure.<br/>
          </p>
          <p>
          <h4>Your account: {account} </h4> <br/>
          <h4>Your email: {email} </h4>
          </p>
        </section>
        <section className="features-section">
          <div className="feature-item">
            <img src="https://cache.careers360.mobi/media/article_images/2022/11/10/neet-pg-2022-revised-cut-off-fresh-mop-up-online-registration.jpg" alt=""/>
            <h1>Online Registration</h1>
            <p>
            Our modern API and mobile <br/>
            devices applications allow <br/>
            you to authenticate from <br />
            any device, wherever you are<br />
            from anywhere in this world.
            </p>
          </div>
          <div className="feature-item">
            <img src="https://avatars.mds.yandex.net/i?id=1cf7009d96f6dba63b09da83fd6f887a385dfc3de534a1bc-12433518-images-thumbs&n=13" alt="" />
            <h1>Information Security</h1>
            <p>
            We use advanced security <br/> 
            techniques,including <br/>
            multi-factor authentication<br/>
            and attack protection.
            </p>
          </div>
          <div className="feature-item">
            <img src="https://avatars.mds.yandex.net/i?id=bcb9c1a2f0aee49e7d591a9ea118b48e_l-9701297-images-thumbs&n=15" alt="" />
            <h1>Fast and Convenient</h1>
            <p>
            Simple and intuitive integration <br/>
            into applications, performing the <br/>
            least number of user input operations.
            </p>
          </div>
          <div className="feature-item">
            <img src="https://www.hse.ru/data/2023/12/04/2111514184/3thumb-scaled2231.jpg.(1000x1000x1).jpg" alt="" />
            <h1>Compliance </h1>
            <p>
            Full compliance with regulatory <br/>
            requirements and safety <br/>
            standards including <br/>
            OAuth 2.0, OIDC2 and FIDO 2.
            </p>
          </div>
        </section>
        <section className="blog-section">
          <h1>Latest Articles</h1>
          <div className="article-container">
            <div className="article">
              <img src="https://imageio.forbes.com/specials-images/imageserve/5e94dc7a7be2870006cde8b5/0x0.jpg?format=jpg&amp;crop=4779,2688,x0,y242,safe&amp;width=1200" alt="" width="300"/>
              <div className="content">
                <p>AuthPrimus</p>
                <h4>
                  Recieve money in any<br />
                  currency with no fees.
                </h4>
                <p>
                  The world is getting smaller and<br />
                  we are becoming more mobile.So,<br />
                  why should you be forced to only<br />
                  receive money in a single...
                </p>
              </div>
            </div>
            <div className="article">
              <img src="https://i.pinimg.com/originals/8d/7f/8e/8d7f8e84a40e861954b76984f9a3677e.jpg" alt="" />
              <div className="content">
                <p>AuthPrimus</p>
                <h4>
                WebAuthn as an <br/>
                alternative to passwords.
                </h4>
                <p>
                Passwords are also easy to phish,<br/>
                with attackers constantly coming<br/>
                up with more sophisticated <br/>
                types of attacks ...
                </p>
              </div>
            </div>
            <div className="article">
              <img src="https://truedigitalsecurity.com/assets/images/buckets/blog-phising-180212.jpg" alt="" />
              <div className="content">
                <p>AuthPrimus</p>
                <h4>
                A Complete Guide to <br/>
                Phishing Attacks.
                </h4>
                <p>
                Since the invention of e-mail,<br/>
                phishing attacks have been <br/>
                targeted by both individuals and organizations
                </p>
              </div>
            </div>
            <div className="article">
              <img src="https://static.vecteezy.com/ti/gratis-vector/p2/37206993-vingerafdruk-scannen-biometrie-identificatie-persoonlijk-gegevens-bescherming-cyber-veiligheid-privaat-beveiligen-veiligheid-achtergrond-met-stroomkring-bord-verbindingen-en-tech-pictogrammen-illustratie-vector.jpg" alt="" />
              <div className="content">
                <p>AuthPrimus</p>
                <h4>
                 Biometrics, nuances and <br/>
                 subtleties of processing
                </h4>
                <p>
                In this article, we will try <br/>
                to figure out what applies to <br/>
                biometric data and what processing features
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <footer className="footer">
      <div className="footer-container">
          <div className="social-container">
            <img src="./images/icon-facebook.svg" alt="jhj" />
            <img src="./images/icon-instagram.svg" alt="" />
            <img src="./images/icon-twitter.svg" alt="" />
            <img src="./images/icon-pinterest.svg" alt="" />
          </div>
          <nav className="menu">
          <ul className="nav-items">
            <li><a href="#">About us</a></li>
            <li><a href="#">Contact us</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Carriers</a></li>
            <li><a href="#">Support</a></li>
            <li><a href="#">Invite</a></li>
          </ul>
          </nav>
          <button>Request Invite</button>
        </div>
      </footer>
    </div>
  );
}
