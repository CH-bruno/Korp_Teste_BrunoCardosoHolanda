import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotaDetalhe } from './nota-detalhe';

describe('NotaDetalhe', () => {
  let component: NotaDetalhe;
  let fixture: ComponentFixture<NotaDetalhe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotaDetalhe],
    }).compileComponents();

    fixture = TestBed.createComponent(NotaDetalhe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
