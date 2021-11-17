"""added customer name field to drink order

Revision ID: 2ee48e448707
Revises: 29d6a41b6c25
Create Date: 2021-11-10 18:52:34.123842

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2ee48e448707'
down_revision = '29d6a41b6c25'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.add_column(sa.Column('customer_name', sa.String(), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.drop_column('customer_name')

    # ### end Alembic commands ###
