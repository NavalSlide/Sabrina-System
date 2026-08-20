# Repairs DB drift: an untracked migration (no longer present on disk) dropped
# this column after 0002 added it, leaving the DB out of sync with model state.
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("academico", "0002_materia_creditos"),
    ]

    operations = [
        migrations.RunSQL(
            sql="ALTER TABLE academico_materia ADD COLUMN IF NOT EXISTS creditos integer NOT NULL DEFAULT 1;",
            reverse_sql="ALTER TABLE academico_materia DROP COLUMN IF EXISTS creditos;",
            state_operations=[],
        ),
    ]
