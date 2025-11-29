import { Component, OnInit } from '@angular/core';
import { FashionService } from './fashion.service';
import { Dress } from './fashion.model';
import { Router } from '@angular/router';



@Component({
  selector: 'app-fashion',
  templateUrl: './fashion.component.html',
  styleUrls: ['./fashion.component.scss'],
})

export class FashionComponent  implements OnInit {
    items: Dress[] = [];
    selectedImage: { path: string; name: string } | null = null;
    magnifierVisible: boolean = false;
    magnifierStyle: any = {};

  constructor(
    private fashionService: FashionService,
    private router: Router
  ) {}


  ngOnInit(): void {this.fashionService.getData().subscribe((data: Dress[]) => { this.items = data; });
  }

  goToItem(item: Dress) {
    this.router.navigate(['/fashion-detail'], {state: { item } });
  }

  openImage(imagePath: string, itemName: string) {
    this.selectedImage = { path: imagePath, name: itemName };
  }

  closeImage() {
    this.selectedImage = null;
    this.magnifierVisible = false;
  }

  onImageMouseEnter() {
    this.magnifierVisible = true;
  }

  onImageMouseLeave() {
    this.magnifierVisible = false;
  }

  onImageMouseMove(event: MouseEvent) {
    if (!this.selectedImage) return;

    // Получаем элемент изображения
    const imgElement = (event.currentTarget as HTMLElement).querySelector('img') as HTMLImageElement;
    if (!imgElement) return;

    const imgRect = imgElement.getBoundingClientRect();

    // Координаты курсора относительно изображения
    const x = event.clientX - imgRect.left;
    const y = event.clientY - imgRect.top;

    // Проверяем, что курсор находится в пределах изображения
    if (x < 0 || y < 0 || x > imgRect.width || y > imgRect.height) {
      this.magnifierVisible = false;
      return;
    }

    const magnifierSize = 250;
    const scale = 3;

    // Позиция лупы точно на курсоре (вычитаем половину размера для центрирования)
    const magnifierX = event.clientX - magnifierSize * 2;
    const magnifierY = event.clientY ;

    // Размеры отображаемого изображения
    const imgDisplayWidth = imgRect.width;
    const imgDisplayHeight = imgRect.height;

    // Размеры увеличенного фона
    const bgWidth = imgDisplayWidth * scale;
    const bgHeight = imgDisplayHeight * scale;

    // Позиция точки на увеличенном изображении
    const bgX = x * scale;
    const bgY = y * scale;

    // Смещаем фон так, чтобы точка под курсором была в центре лупы
    const bgPositionX = -(bgX - magnifierSize / 2);
    const bgPositionY = -(bgY - magnifierSize / 2);

    this.magnifierStyle = {
      left: magnifierX + 'px',
      top: magnifierY + 'px',
      backgroundImage: `url(${this.selectedImage.path})`,
      backgroundSize: `${bgWidth}px ${bgHeight}px`,
      backgroundPosition: `${bgPositionX}px ${bgPositionY}px`,
      backgroundRepeat: 'no-repeat'
    };
  }
}
