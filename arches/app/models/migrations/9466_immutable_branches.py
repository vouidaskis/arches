# Generated by Django 3.2.15 on 2023-03-31 15:48

import arches.app.models.fields.i18n
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("models", "9055_add_branch_publication_to_node"),
    ]

    operations = [
        migrations.AddField(
            model_name="graphmodel",
            name="is_copy_immutable",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="node",
            name="is_immutable",
            field=models.BooleanField(default=False),
        ),
    ]
