import { Component, ViewChild, inject } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet } from "@angular/router";
import { filter } from "rxjs/operators";
import { CommonModule } from "@angular/common";
import { User } from "./model/user.type";
import { UserService } from "./services/user.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterModule, CommonModule ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css"
})

export class AppComponent {
  title = "ToDo Website";
  urlName: string | null = '';
  isDark = false;
  user?: User | null;
  userService = inject(UserService);

  constructor(private router: Router, private route: ActivatedRoute) {
    this.userService.user.subscribe(x => this.user = x);
  }


  ngOnInit(): void {
    // Set theme based on localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      this.isDark = true;
    }
    // Listen to route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentUrl = this.router.url;
        const segments = currentUrl.split('/');
        const secondSegment = segments[1];
        switch (secondSegment) {
          case 'todos':
            this.urlName = 'To-Do`s';
            break;
          case 'dustbin':
            this.urlName = 'Dustbin';
            break;
          case 'calendar':
            this.urlName = 'Calendar';
            break;
          case 'categories':
            this.urlName = 'Categories';
            break;
          default:
            this.urlName = 'Home';
            break;
        }
      });
  }

  toggleTheme(): void {
    document.body.classList.toggle('dark-theme');
    this.isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
  }

  logout() {
    this.userService.logout();
  }

}

