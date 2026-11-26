from datetime import datetime
from decimal import Decimal
import random
from typing import List

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from sqlalchemy.orm import Session

import models
import schemas
from database import Base, SessionLocal, engine, get_db
from seed import popular_banco_inicial

Base.metadata.create_all(bind=engine)

# Executa o seed inicial
with SessionLocal() as db:
    popular_banco_inicial(db)

app = FastAPI(title="Pets’co API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
FRETE_GRATIS = Decimal("99.00")
VALOR_FRETE = Decimal("12.90")


# ==================== PRODUTOS ====================
@app.get("/api/produtos", response_model=List[schemas.ProdutoOut])
def listar_produtos(db: Session = Depends(get_db)):
    return db.query(models.Produto).order_by(models.Produto.id.asc()).all()


@app.post("/api/produtos", response_model=schemas.ProdutoOut, status_code=status.HTTP_201_CREATED)
def criar_produto(payload: schemas.ProdutoIn, db: Session = Depends(get_db)):
    prod = models.Produto(**payload.model_dump())
    db.add(prod)
    db.commit()
    db.refresh(prod)
    return prod


@app.put("/api/produtos/{produto_id}", response_model=schemas.ProdutoOut)
def atualizar_produto(produto_id: int, payload: schemas.ProdutoIn, db: Session = Depends(get_db)):
    prod = db.query(models.Produto).filter(models.Produto.id == produto_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    for k, v in payload.model_dump().items():
        setattr(prod, k, v)
    db.commit()
    db.refresh(prod)
    return prod


@app.delete("/api/produtos/{produto_id}", status_code=status.HTTP_204_NO_CONTENT)
def excluir_produto(produto_id: int, db: Session = Depends(get_db)):
    prod = db.query(models.Produto).filter(models.Produto.id == produto_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    db.delete(prod)
    db.commit()


# ==================== AUTENTICAÇÃO E CONTA ====================
@app.post("/api/auth/registro", response_model=schemas.UsuarioBaseOut, status_code=status.HTTP_201_CREATED)
def registrar(payload: schemas.RegistroIn, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()
    if db.query(models.Usuario).filter(models.Usuario.email == email).first():
        raise HTTPException(status_code=400, detail="Este e-mail já tem cadastro. Use a aba Entrar.")

    user = models.Usuario(
        name=payload.name.strip(),
        email=email,
        phone=(payload.phone or "").strip(),
        pass_hash=pwd_context.hash(payload.senha),
        role="tutor",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.post("/api/auth/login", response_model=schemas.UsuarioBaseOut)
def login(payload: schemas.LoginIn, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()
    user = db.query(models.Usuario).filter(models.Usuario.email == email).first()
    if not user or not pwd_context.verify(payload.senha, user.pass_hash):
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos. Confira e tente de novo.")
    return user


@app.get("/api/usuarios/{usuario_id}", response_model=schemas.UsuarioCompletoOut)
def obter_usuario_completo(usuario_id: int, db: Session = Depends(get_db)):
    user = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user


@app.put("/api/usuarios/{usuario_id}", response_model=schemas.UsuarioBaseOut)
def atualizar_usuario(usuario_id: int, payload: schemas.UsuarioUpdateIn, db: Session = Depends(get_db)):
    user = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    user.name = payload.name.strip()
    user.phone = (payload.phone or "").strip()
    db.commit()
    db.refresh(user)
    return user


@app.delete("/api/usuarios/{usuario_id}", status_code=status.HTTP_204_NO_CONTENT)
def excluir_usuario(usuario_id: int, db: Session = Depends(get_db)):
    user = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    if user.email == "admin":
        raise HTTPException(status_code=400, detail="Não é possível excluir o administrador principal")
    db.delete(user)
    db.commit()


# ==================== PETS ====================
@app.post("/api/usuarios/{usuario_id}/pets", response_model=schemas.PetOut, status_code=status.HTTP_201_CREATED)
def adicionar_pet(usuario_id: int, payload: schemas.PetIn, db: Session = Depends(get_db)):
    pet = models.Pet(usuario_id=usuario_id, **payload.model_dump())
    db.add(pet)
    db.commit()
    db.refresh(pet)
    return pet


@app.delete("/api/pets/{pet_id}", status_code=status.HTTP_204_NO_CONTENT)
def remover_pet(pet_id: int, db: Session = Depends(get_db)):
    pet = db.query(models.Pet).filter(models.Pet.id == pet_id).first()
    if pet:
        db.delete(pet)
        db.commit()


# ==================== AGENDAMENTOS ====================
@app.post("/api/agendamentos", response_model=schemas.AgendamentoOut, status_code=status.HTTP_201_CREATED)
def criar_agendamento(payload: schemas.AgendamentoIn, db: Session = Depends(get_db)):
    ag = models.Agendamento(**payload.model_dump())
    db.add(ag)
    db.commit()
    db.refresh(ag)
    return ag


@app.patch("/api/agendamentos/{ag_id}/concluir", response_model=schemas.AgendamentoOut)
def concluir_agendamento(ag_id: int, db: Session = Depends(get_db)):
    ag = db.query(models.Agendamento).filter(models.Agendamento.id == ag_id).first()
    if not ag:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
    ag.feito = True
    db.commit()
    db.refresh(ag)
    return ag


@app.delete("/api/agendamentos/{ag_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancelar_agendamento(ag_id: int, db: Session = Depends(get_db)):
    ag = db.query(models.Agendamento).filter(models.Agendamento.id == ag_id).first()
    if ag:
        db.delete(ag)
        db.commit()


# ==================== PEDIDOS (CARRINHO) ====================
@app.post("/api/pedidos", response_model=schemas.PedidoOut, status_code=status.HTTP_201_CREATED)
def criar_pedido(payload: schemas.PedidoIn, db: Session = Depends(get_db)):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Carrinho vazio")

    subtotal = Decimal("0.00")
    itens_modelo = []

    for item in payload.items:
        prod = db.query(models.Produto).filter(models.Produto.id == item.produto_id).first()
        if not prod:
            raise HTTPException(status_code=404, detail=f"Produto {item.produto_id} não encontrado")
        subtotal += Decimal(str(prod.preco)) * item.q
        itens_modelo.append(
            models.PedidoItem(
                produto_id=prod.id,
                n=prod.nome,
                q=item.q,
                preco_unit=prod.preco,
            )
        )

    frete = Decimal("0.00") if subtotal >= FRETE_GRATIS else VALOR_FRETE
    codigo = f"{random.randint(100000, 999999)}"

    pedido = models.Pedido(
        codigo=codigo,
        usuario_id=payload.usuario_id,
        date=datetime.now().strftime("%d/%m/%Y"),
        total=subtotal + frete,
        status="Em preparo",
        items=itens_modelo,
    )
    db.add(pedido)
    db.commit()
    db.refresh(pedido)
    return pedido


@app.patch("/api/pedidos/{pedido_id}/status", response_model=schemas.PedidoOut)
def atualizar_status_pedido(pedido_id: int, payload: schemas.PedidoStatusIn, db: Session = Depends(get_db)):
    pedido = db.query(models.Pedido).filter(models.Pedido.id == pedido_id).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    pedido.status = payload.status
    db.commit()
    db.refresh(pedido)
    return pedido


# ==================== PAINEL ADMIN ====================
@app.get("/api/admin/painel")
def obter_dados_admin(db: Session = Depends(get_db)):
    usuarios = db.query(models.Usuario).all()
    agendamentos = db.query(models.Agendamento).order_by(models.Agendamento.data.asc(), models.Agendamento.hora.asc()).all()
    pedidos = db.query(models.Pedido).order_by(models.Pedido.id.desc()).all()

    return {
        "usuarios": [
            {
                "id": u.id,
                "name": u.name,
                "email": u.email,
                "phone": u.phone,
                "role": u.role,
                "pets_count": len(u.pets),
                "appts_count": len(u.appts),
                "orders_count": len(u.orders),
            }
            for u in usuarios
        ],
        "agendamentos": [
            {
                "id": a.id,
                "tipo": a.tipo,
                "svc": a.svc,
                "pet": a.pet,
                "data": a.data,
                "hora": a.hora,
                "feito": a.feito,
                "nome_tutor": a.nome_tutor,
                "telefone": a.telefone,
            }
            for a in agendamentos
        ],
        "pedidos": [
            {
                "id": o.id,
                "codigo": o.codigo,
                "date": o.date,
                "total": float(o.total),
                "status": o.status,
                "cliente_nome": o.usuario.name if o.usuario else "Cliente",
                "cliente_phone": o.usuario.phone if o.usuario else "",
                "items": [{"n": i.n, "q": i.q} for i in o.items],
            }
            for o in pedidos
        ],
    }


@app.patch("/api/admin/usuarios/{usuario_id}/role", response_model=schemas.UsuarioBaseOut)
def alternar_role_usuario(usuario_id: int, db: Session = Depends(get_db)):
    user = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if not user or user.email == "admin":
        raise HTTPException(status_code=400, detail="Operação inválida")
    user.role = "tutor" if user.role == "admin" else "admin"
    db.commit()
    db.refresh(user)
    return user


# ==================== CONTATO (sobre.html) ====================
@app.post("/api/contato", status_code=status.HTTP_201_CREATED)
def enviar_contato(payload: schemas.ContatoIn, db: Session = Depends(get_db)):
    msg = models.MensagemContato(**payload.model_dump())
    db.add(msg)
    db.commit()
    return {"ok": True}