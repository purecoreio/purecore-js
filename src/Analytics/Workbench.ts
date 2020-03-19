class Workbench {

    public arrayToLegacy(array): Array<Analytic> {
        var final = new Array<Analytic>();
        array.forEach(element => {
            var analytic = element.toLegacy();
            final.push(analytic);
        });
        return final;
    }

    public stack(analytics: Array<Analytic> = new Array<Analytic>(), maxSeconds = 0): Array<Analytic> {

        var finalAnalytics = new Array<Analytic>();
        var timestampStart = null;
        var itemBeingWorkedOn: Analytic = null;

        analytics.forEach(analytic => {

            if (timestampStart == null) {
                timestampStart = analytic.getTimestamp();
                itemBeingWorkedOn = analytic;
            } else {
                if ((timestampStart - analytic.getTimestamp()) >= maxSeconds) {
                    finalAnalytics.push(itemBeingWorkedOn);
                    itemBeingWorkedOn = analytic;
                    timestampStart = analytic.getTimestamp();
                } else {
                    if (itemBeingWorkedOn.getOriginal() instanceof VoteAnalytic || itemBeingWorkedOn.getOriginal() instanceof IncomeAnalytic) {

                        var fields = itemBeingWorkedOn.getFields();
                        var newFields = new Array<AnalyticField>();
                        fields.forEach(field => {
                            analytic.getFields().forEach(fieldTemporal => {
                                if (field.getTechnicalName() == fieldTemporal.getTechnicalName()) {
                                    var newField = new AnalyticField(field.value + fieldTemporal.value, field.name, field.technicalName)
                                    newFields.push(newField)
                                }
                            });
                        });
                        itemBeingWorkedOn.setFields(newFields);

                    } else if (itemBeingWorkedOn.getOriginal() instanceof GrowthAnalytic) {

                        var fields = itemBeingWorkedOn.getFields();
                        var newFields = new Array<AnalyticField>();
                        fields.forEach(field => {
                            analytic.getFields().forEach(fieldTemporal => {
                                if (field.getTechnicalName() == fieldTemporal.getTechnicalName()) {
                                    var newField = new AnalyticField(field.value, field.name, field.technicalName)
                                    newFields.push(newField)
                                }
                            });
                        });
                        itemBeingWorkedOn.setFields(newFields);

                    }
                }
            }

        });

        if (!finalAnalytics.includes(itemBeingWorkedOn)) {
            finalAnalytics.push(itemBeingWorkedOn);
        }

        return finalAnalytics;

    }

    public toApexSeries(analyticArray: Array<Analytic>) {
        var fieldData = [];
        analyticArray.forEach(analytic => {
            var timestamp = analytic.getTimestamp();
            analytic.getFields().forEach(field => {
                if (!(field.getTechnicalName() in fieldData)) {
                    fieldData[field.getTechnicalName()] = {};
                    fieldData[field.getTechnicalName()]["values"] = [];
                    fieldData[field.getTechnicalName()]["name"] = field.getName();
                }
                fieldData[field.getTechnicalName()].values.push(
                    {
                        x: timestamp,
                        y: field.getValue()
                    }
                )
            });
        });
        var finalSeries = [];
        for (const key in fieldData) {
            if (fieldData.hasOwnProperty(key)) {
                const element = fieldData[key];
                var finalSerie = {
                    name: element.name,
                    data: element.values
                }
                finalSeries.push(finalSerie);

            }
        }
        return finalSeries;
    }

}