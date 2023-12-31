class LindatHeader extends HTMLElement {


  connectedCallback(){
    let shadow = this.attachShadow({mode: 'open'})
    shadow.innerHTML = HTML
    const linkElement = document.createElement('link')
    linkElement.setAttribute('rel', 'stylesheet')
    linkElement.setAttribute('href', `${PUBLICPATH}public/css/lindat.css`)

    shadow.appendChild(linkElement)
  }
}

export {LindatHeader}

const HTML = `

<div class="lindat-common2 lindat-common-header">
<header data-version="3.2.0" data-build="ce204db1afa6b344bf67dcddd4f28025c385990a">
    <nav class="lindat-navbar lindat-navbar-expand-lg lindat-justify-content-between lindat-navbar-dark ">
        <div class="lindat-block lindat-block--clariah-theme-branding">
            <a href="https://lindat.mff.cuni.cz/" class="lindat-navbar-brand lindat-d-flex lindat-align-items-center " aria-label="">
                <img src="https://lindat.mff.cuni.cz/sites/default/files/LINDAT-CLARIAH-cz-gray_0.svg" width="auto" height="53" style="height: 53px !important;" alt="LINDAT/CLARIAH-CZ logo" class="" />
            </a>
        </div>
        <button class="lindat-navbar-toggler" type="button" data-toggle="collapse" data-target=".lindat-navbar-collapse" aria-controls="lindat-navbar-collapse" aria-expanded="false" aria-label="Toggle navigation"
                onclick="this.parentNode.querySelector('.lindat-navbar-toggler+div.lindat-collapse.lindat-navbar-collapse').classList.toggle('lindat-show')">
            <span class="lindat-navbar-toggler-icon"></span>
        </button>
        <div class="lindat-collapse lindat-navbar-collapse">
            <div class="">
                <div class="lindat-block lindat-block--clariah-theme-main-menu">
                    <ul class="lindat-nav lindat-navbar-nav">
                        
          <li class="lindat-nav-item ">
              <a href="https://lindat.cz/services/catalog/" class="lindat-nav-link "
                                    
                                    
                                    >Catalog</a>
              
          </li>
        
          <li class="lindat-nav-item ">
              <a href="https://lindat.mff.cuni.cz/repository/xmlui/?locale-attribute=en" class="lindat-nav-link "
                                    
                                    
                                    >Repository</a>
              
          </li>
        
          <li class="lindat-nav-item ">
              <a href="https://lindat.cz/#education" class="lindat-nav-link "
                                    
                                    
                                    >Education</a>
              
          </li>
        
          <li class="lindat-nav-item ">
              <a href="https://lindat.cz/#projects" class="lindat-nav-link "
                                    
                                    
                                    >Projects</a>
              
          </li>
        
          <li class="lindat-nav-item ">
              <a href="https://lindat.cz/#tools" class="lindat-nav-link "
                                    
                                    
                                    >Tools</a>
              
          </li>
        
          <li class="lindat-nav-item ">
              <a href="https://lindat.cz/en/services" class="lindat-nav-link "
                                    
                                    
                                    >Services</a>
              
          </li>
        
          <li class="lindat-nav-item lindat-dropdown">
              <a href="https://lindat.cz/" class="lindat-nav-link lindat-dropdown-toggle"
                                     data-toggle="dropdown"
                                     onclick="this.parentNode.querySelector('.lindat-dropdown-toggle+div.lindat-dropdown-menu').classList.toggle('lindat-show'); return false;"
                                    >About</a>
              <div class="lindat-dropdown-menu">
               <a href="https://lindat.cz/partners" class="lindat-dropdown-item">Partners</a>
            
               <a href="https://lindat.cz/files/mission-en.pdf" class="lindat-dropdown-item">Mission Statement</a>
            
               <a href="https://www.clarin.eu/" class="lindat-dropdown-item">CLARIN</a>
            
               <a href="https://www.dariah.eu/" class="lindat-dropdown-item">DARIAH</a>
            
               <a href="https://lindat.cz/integration" class="lindat-dropdown-item">Service integrations</a>
            
               <a href="https://lindat.cz/partnership" class="lindat-dropdown-item">Project partnerships</a>
            </div>
          </li>
        
                    </ul>
                </div>
            </div>
            <div class="lindat-block lindat-block--clariah-theme-account-menu">
                <ul class="lindat-nav lindat-navbar-nav">
                    <li class="lindat-nav-item" id="margin-filler"></li>
                    <li class="lindat-nav-item  ">
                        <a class="lindat-nav-link lindat-nav-link-dariah" href="https://www.dariah.eu/"><img src="https://lindat.mff.cuni.cz/images/dariah-eu.png" alt="DARIAH logo" /></a>
                    </li>
                    <li class="lindat-nav-item  ">
                        <a class="lindat-nav-link lindat-nav-link-clarin" href="https://www.clarin.eu/"><img src="https://lindat.mff.cuni.cz/images/clarin.png" alt="CLARIN logo" /></a>
                    </li>
                </ul>
            </div>
            <slot name="languageswitcher"></slot>
        </div>
    </nav>
</header>
</div>
    
`;
const PUBLICPATH = "https://lindat.mff.cuni.cz/common/";