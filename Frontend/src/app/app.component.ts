import { Component, inject } from "@angular/core";
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
  user?: User | null;
  userService = inject(UserService);
  dropDown: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.userService.user.subscribe(x => this.user = x);
  }

  ngOnInit(): void {
    // Auf jede Navigation hören
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentUrl = this.router.url;
        const segments = currentUrl.split('/');
        const secondSegement = segments[1];
        switch (secondSegement) {
          case 'todos':
            this.urlName = 'To-Do`s';
            break;
          //Beispiel
          // case '[url]':
          // this.urlName = '[shown text]';
          // break;
          default:
            this.urlName = 'Home';
            break;
        }
      });
  }

  logout() {
    this.userService.logout();
    this.dropDown = false;
  }

  toggleDropdown() {
    this.dropDown = true;
  }
}
