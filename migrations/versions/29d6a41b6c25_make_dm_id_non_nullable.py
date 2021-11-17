"""make dm id non nullable

Revision ID: 29d6a41b6c25
Revises: 4ce6067bb1f9
Create Date: 2021-11-09 12:46:54.447709

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '29d6a41b6c25'
down_revision = '4ce6067bb1f9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.alter_column('location_json',
               existing_type=sa.VARCHAR(),
               nullable=False)
        batch_op.alter_column('drink_meister_id',
               existing_type=sa.INTEGER(),
               nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.alter_column('drink_meister_id',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.alter_column('location_json',
               existing_type=sa.VARCHAR(),
               nullable=True)

    # ### end Alembic commands ###
