# Generated by Django 4.2.9 on 2024-01-11 15:39

import arches.app.models.fields.i18n
import arches.app.utils.betterJSONSerializer
from django.db import migrations
from django.conf import settings


class Migration(migrations.Migration):
    dependencies = [
        ("models", "9946_alter_notification_context"),
    ]

    sql = """
        SET CONSTRAINTS ALL IMMEDIATE;
        UPDATE public.plugins SET name=json_build_object('{0}', name);
        UPDATE public.plugins
        SET config =
        jsonb_set(config, '{{description}}', json_build_object('{0}', config->>'description')::jsonb, true)
         ||
        '{{"i18n_properties": ["description"]}}';
        SET CONSTRAINTS ALL DEFERRED;
    """.format(
        settings.LANGUAGE_CODE
    )

    reverse_sql = """
        UPDATE public.plugins SET name=name::jsonb->>'{0}'::text;
        UPDATE public.plugins
        set config = config - 'i18n_properties' ||
        json_build_object('description', jsonb_extract_path(config, 'description', '{0}'))::jsonb 
    """.format(
        settings.LANGUAGE_CODE
    )

    operations = [
        migrations.RunSQL(sql, reverse_sql),
        migrations.AlterField(
            model_name="plugin",
            name="config",
            field=arches.app.models.fields.i18n.I18n_JSONField(
                blank=True, db_column="config", encoder=arches.app.utils.betterJSONSerializer.JSONSerializer, null=True
            ),
        ),
        migrations.AlterField(
            model_name="plugin",
            name="name",
            field=arches.app.models.fields.i18n.I18n_TextField(
                blank=True, default="", encoder=arches.app.utils.betterJSONSerializer.JSONSerializer, null=True
            ),
        ),
    ]
