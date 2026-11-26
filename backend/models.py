from sqlalchemy import (
    Boolean, Column, DECIMAL, ForeignKey, Integer, String, Text, TIMESTAMP, func
)
from sqlalchemy.dialects.mysql import MEDIUMTEXT
from sqlalchemy.orm import relationship
from database import Base


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    phone = Column(String(30), default="")
    pass_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="tutor", nullable=False)  # 'tutor' ou 'admin'
    criado_em = Column(TIMESTAMP, server_default=func.now())

    pets = relationship("Pet", back_populates="dono", cascade="all, delete-orphan")
    appts = relationship("Agendamento", back_populates="usuario")
    orders = relationship("Pedido", back_populates="usuario", cascade="all, delete-orphan")


class Pet(Base):
    __tablename__ = "pets"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False)
    nome = Column(String(80), nullable=False)
    raca = Column(String(80), default="")
    especie = Column(String(30), nullable=False)  # Cachorro, Gato, Outro
    porte = Column(Integer, default=0, nullable=False)  # 0 = Pequeno, 1 = Médio, 2 = Grande

    dono = relationship("Usuario", back_populates="pets")


class Produto(Base):
    __tablename__ = "produtos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    preco = Column(DECIMAL(10, 2), nullable=False)
    categoria = Column(String(50), nullable=False)
    pet = Column(String(30), nullable=False)  # Cães, Gatos, Ambos
    destaque = Column(Boolean, default=False)
    foto = Column(MEDIUMTEXT, default="")
    descricao = Column(Text, default="")
    caracteristicas = Column(Text, default="")


class Agendamento(Base):
    __tablename__ = "agendamentos"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id", ondelete="SET NULL"), nullable=True)
    nome_tutor = Column(String(120), nullable=False)
    telefone = Column(String(30), nullable=False)
    tipo = Column(String(40), nullable=False)  # 'Banho e Tosa' ou 'Veterinário'
    svc = Column(String(100), nullable=False)
    pet = Column(String(80), nullable=False)
    extra = Column(String(60), default="")
    data = Column(String(10), nullable=False)  # YYYY-MM-DD
    hora = Column(String(5), nullable=False)   # HH:MM
    obs = Column(Text, default="")
    feito = Column(Boolean, default=False)
    criado_em = Column(TIMESTAMP, server_default=func.now())

    usuario = relationship("Usuario", back_populates="appts")


class Pedido(Base):
    __tablename__ = "pedidos"

    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String(20), unique=True, nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False)
    date = Column(String(20), nullable=False)
    total = Column(DECIMAL(10, 2), nullable=False)
    status = Column(String(40), default="Em preparo", nullable=False)
    ts = Column(TIMESTAMP, server_default=func.now())

    usuario = relationship("Usuario", back_populates="orders")
    items = relationship("PedidoItem", back_populates="pedido", cascade="all, delete-orphan")


class PedidoItem(Base):
    __tablename__ = "pedido_itens"

    id = Column(Integer, primary_key=True, index=True)
    pedido_id = Column(Integer, ForeignKey("pedidos.id", ondelete="CASCADE"), nullable=False)
    produto_id = Column(Integer, ForeignKey("produtos.id", ondelete="SET NULL"), nullable=True)
    n = Column(String(100), nullable=False)
    q = Column(Integer, nullable=False)
    preco_unit = Column(DECIMAL(10, 2), nullable=False)

    pedido = relationship("Pedido", back_populates="items")


class MensagemContato(Base):
    __tablename__ = "mensagens_contato"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(120), nullable=False)
    email = Column(String(150), nullable=False)
    mensagem = Column(Text, nullable=False)
    criado_em = Column(TIMESTAMP, server_default=func.now())